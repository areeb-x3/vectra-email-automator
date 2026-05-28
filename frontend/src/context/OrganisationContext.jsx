import React, { createContext, useContext, useState, useEffect } from 'react';
import { orgAPI } from '../lib/api';

const OrganisationContext = createContext();

export const useOrganisations = () => {
  const context = useContext(OrganisationContext);
  if (!context) {
    throw new Error('useOrganisations must be used within an OrganisationProvider');
  }
  return context;
};

export const OrganisationProvider = ({ children }) => {
  const [organisations, setOrganisations] = useState([]);
  const [activeOrganisationId, setActiveOrganisationId] = useState(null);

  // Helper to format string recipients from backend into structured object format expected by React
  const formatOrganisations = (orgs) => {
    return (orgs || []).map(org => ({
      ...org,
      groups: (org.groups || []).map(group => ({
        ...group,
        recipients: (group.recipients || []).map(r => {
          if (typeof r === 'string') {
            return { email: r, name: r.split('@')[0] };
          }
          return r;
        })
      }))
    }));
  };

  // Load organisations from Django backend on mount
  useEffect(() => {
    orgAPI.listOrganisations()
      .then(res => {
        if (res.status === 'success' && res.organisations) {
          setOrganisations(formatOrganisations(res.organisations));
        }
      })
      .catch(err => console.error('Failed to load organisations from backend:', err));
  }, []);

  const addActivity = (orgId, activity) => {
    setOrganisations(prev => prev.map(org => {
      if (org.id === orgId) {
        return {
          ...org,
          activities: [
            { 
              id: crypto.randomUUID(), 
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
              fullDate: new Date().toLocaleString(),
              dateKey: new Date().toLocaleDateString('en-CA'),
              ...activity 
            }, 
            ...(org.activities || [])
          ].slice(0, 100)
        };
      }
      return org;
    }));
  };

  const addOrganisation = async (org) => {
    const formData = new FormData();
    formData.append('name', org.name);
    formData.append('description', org.description || '');

    try {
      const res = await orgAPI.createOrganisation(formData);
      if (res.status === 'success' && res.organisation) {
        const newOrgId = res.organisation.id;

        // If groups exist in the imported CSV, create them sequentially on the backend
        if (org.groups && org.groups.length > 0) {
          for (const group of org.groups) {
            const emailsStr = group.recipients 
              ? group.recipients.map(r => typeof r === 'string' ? r : r.email).join(',') 
              : '';
            await orgAPI.createGroup(group.name, emailsStr, newOrgId);
          }
        }

        const refreshed = await orgAPI.listOrganisations();
        if (refreshed.status === 'success' && refreshed.organisations) {
          setOrganisations(formatOrganisations(refreshed.organisations));
          const newOrg = refreshed.organisations.find(o => o.name === org.name);
          if (newOrg) {
            addActivity(newOrg.id, { 
              type: 'settings', 
              content: 'Organisation created', 
              status: 'success' 
            });
            return newOrg;
          }
        }
      }
    } catch (err) {
      console.error('Failed to create organisation on backend:', err);
    }
  };

  const updateOrganisation = async (id, updates) => {
    const formData = new FormData();
    formData.append('org_id', id);
    formData.append('name', updates.name);
    formData.append('description', updates.description || '');

    try {
      const res = await orgAPI.modifyOrganisation(formData);
      if (res.status === 'success') {
        const refreshed = await orgAPI.listOrganisations();
        if (refreshed.status === 'success' && refreshed.organisations) {
          setOrganisations(formatOrganisations(refreshed.organisations));
          addActivity(id, { 
            type: 'settings', 
            content: `Organisation updated: ${Object.keys(updates).join(', ')}`, 
            status: 'info' 
          });
        }
      }
    } catch (err) {
      console.error('Failed to update organisation on backend:', err);
    }
  };

  const deleteOrganisation = async (id) => {
    try {
      const res = await orgAPI.deleteOrganisation(id);
      if (res.status === 'success') {
        setOrganisations(prev => prev.filter(org => org.id !== id));
        if (activeOrganisationId === id) setActiveOrganisationId(null);
      }
    } catch (err) {
      console.error('Failed to delete organisation on backend:', err);
    }
  };

  const addGroup = async (orgId, group) => {
    try {
      const recipientsStr = group.recipients 
        ? group.recipients.map(r => typeof r === 'string' ? r : r.email).join(',') 
        : '';
      const res = await orgAPI.createGroup(group.name, recipientsStr, orgId);
      if (res.status === 'success') {
        const refreshed = await orgAPI.listOrganisations();
        if (refreshed.status === 'success' && refreshed.organisations) {
          setOrganisations(formatOrganisations(refreshed.organisations));
          addActivity(orgId, { type: 'groups', content: `Group "${group.name}" created`, status: 'success' });
        }
      }
    } catch (err) {
      console.error('Failed to add group on backend:', err);
    }
  };

  const deleteGroup = async (orgId, groupId) => {
    const org = organisations.find(o => o.id === orgId);
    const group = org?.groups.find(g => g.id === groupId);

    try {
      const res = await orgAPI.deleteGroup(orgId, groupId);
      if (res.status === 'success') {
        const refreshed = await orgAPI.listOrganisations();
        if (refreshed.status === 'success' && refreshed.organisations) {
          setOrganisations(formatOrganisations(refreshed.organisations));
          if (group) {
            addActivity(orgId, { type: 'groups', content: `Group "${group.name}" deleted`, status: 'error' });
          }
        }
      }
    } catch (err) {
      console.error('Failed to delete group on backend:', err);
    }
  };

  const updateRecipients = async (orgId, groupId, recipients) => {
    const org = organisations.find(o => o.id === orgId);
    const group = org?.groups.find(g => g.id === groupId);
    if (!group) return;

    const oldCount = group.recipients.length || 0;
    const newCount = recipients.length;

    try {
      const recipientsStr = recipients.map(r => typeof r === 'string' ? r : r.email).join(',');
      const res = await orgAPI.modifyGroup(group.name, recipientsStr, orgId, groupId);
      if (res.status === 'success') {
        const refreshed = await orgAPI.listOrganisations();
        if (refreshed.status === 'success' && refreshed.organisations) {
          setOrganisations(formatOrganisations(refreshed.organisations));
          
          if (newCount > oldCount) {
            addActivity(orgId, { 
              type: 'imports', 
              content: `${newCount - oldCount} recipients added to "${group.name}"`, 
              status: 'success',
              details: `Bulk addition completed. Total group size: ${newCount} recipients.`
            });
          } else if (newCount < oldCount) {
            addActivity(orgId, { 
              type: 'groups', 
              content: `${oldCount - newCount} recipients removed from "${group.name}"`, 
              status: 'info',
              details: `Manual cleanup performed. Remaining group size: ${newCount} recipients.`
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to update group recipients on backend:', err);
    }
  };

  const updateGroupName = async (orgId, groupId, name) => {
    const org = organisations.find(o => o.id === orgId);
    const group = org?.groups.find(g => g.id === groupId);
    if (!group) return;

    const oldName = group.name;

    try {
      const recipientsStr = group.recipients 
        ? group.recipients.map(r => typeof r === 'string' ? r : r.email).join(',') 
        : '';
      const res = await orgAPI.modifyGroup(name, recipientsStr, orgId, groupId);
      if (res.status === 'success') {
        const refreshed = await orgAPI.listOrganisations();
        if (refreshed.status === 'success' && refreshed.organisations) {
          setOrganisations(formatOrganisations(refreshed.organisations));
          if (oldName !== name) {
            addActivity(orgId, { 
              type: 'groups', 
              content: `Group "${oldName}" renamed to "${name}"`, 
              status: 'info',
              details: `Previous Name: ${oldName}\nNew Name: ${name}`
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to rename group on backend:', err);
    }
  };

  const getActiveOrganisation = () => {
    return organisations.find(org => org.id === activeOrganisationId);
  };

  return (
    <OrganisationContext.Provider value={{
      organisations,
      activeOrganisationId,
      setActiveOrganisationId,
      activeOrganisation: getActiveOrganisation(),
      addOrganisation,
      updateOrganisation,
      deleteOrganisation,
      addGroup,
      deleteGroup,
      updateRecipients,
      updateGroupName,
      addActivity
    }}>
      {children}
    </OrganisationContext.Provider>
  );
};
