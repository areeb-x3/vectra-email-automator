import React, { createContext, useContext, useState, useEffect } from 'react';

const OrganisationContext = createContext();

export const useOrganisations = () => {
  const context = useContext(OrganisationContext);
  if (!context) {
    throw new Error('useOrganisations must be used within an OrganisationProvider');
  }
  return context;
};

export const OrganisationProvider = ({ children }) => {
  const [organisations, setOrganisations] = useState(() => {
    const saved = localStorage.getItem('vectra_organisations');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeOrganisationId, setActiveOrganisationId] = useState(null);

  useEffect(() => {
    localStorage.setItem('vectra_organisations', JSON.stringify(organisations));
  }, [organisations]);

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
              dateKey: new Date().toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
              ...activity 
            }, 
            ...(org.activities || [])
          ].slice(0, 100) // Keep last 100 for pagination support
        };
      }
      return org;
    }));
  };

  const addOrganisation = (org) => {
    const newOrg = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      activities: [{ 
        id: crypto.randomUUID(), 
        type: 'settings', 
        content: 'Organisation created', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        dateKey: new Date().toLocaleDateString('en-CA'),
        status: 'success' 
      }],
      ...org,
      groups: (org.groups || []).map(g => ({
        id: crypto.randomUUID(),
        recipients: [],
        ...g
      }))
    };
    setOrganisations(prev => [...prev, newOrg]);
    return newOrg;
  };

  const updateOrganisation = (id, updates) => {
    setOrganisations(prev => prev.map(org => {
      if (org.id === id) {
        addActivity(id, { 
          type: 'settings', 
          content: `Organisation updated: ${Object.keys(updates).join(', ')}`, 
          status: 'info' 
        });
        return { ...org, ...updates };
      }
      return org;
    }));
  };

  const deleteOrganisation = (id) => {
    setOrganisations(prev => prev.filter(org => org.id !== id));
    if (activeOrganisationId === id) setActiveOrganisationId(null);
  };

  const addGroup = (orgId, group) => {
    setOrganisations(prev => prev.map(org => {
      if (org.id === orgId) {
        const newGroup = { id: crypto.randomUUID(), recipients: [], ...group };
        const updatedOrg = {
          ...org,
          groups: [...org.groups, newGroup]
        };
        // Use a timeout or a different way to add activity without recursive state update if needed, 
        // but here it's fine since we are in a map. 
        // Wait, map is pure. I should do it differently.
        return updatedOrg;
      }
      return org;
    }));
    addActivity(orgId, { type: 'groups', content: `Group "${group.name}" created`, status: 'success' });
  };

  const deleteGroup = (orgId, groupId) => {
    const org = organisations.find(o => o.id === orgId);
    const group = org?.groups.find(g => g.id === groupId);
    
    setOrganisations(prev => prev.map(org => {
      if (org.id === orgId) {
        return {
          ...org,
          groups: org.groups.filter(g => g.id !== groupId)
        };
      }
      return org;
    }));
    if (group) {
      addActivity(orgId, { type: 'groups', content: `Group "${group.name}" deleted`, status: 'error' });
    }
  };

  const updateRecipients = (orgId, groupId, recipients) => {
    const org = organisations.find(o => o.id === orgId);
    const group = org?.groups.find(g => g.id === groupId);
    const oldCount = group?.recipients.length || 0;
    const newCount = recipients.length;

    setOrganisations(prev => prev.map(org => {
      if (org.id === orgId) {
        return {
          ...org,
          groups: org.groups.map(g => 
            g.id === groupId ? { ...g, recipients } : g
          )
        };
      }
      return org;
    }));

    if (newCount > oldCount) {
      addActivity(orgId, { 
        type: 'imports', 
        content: `${newCount - oldCount} recipients added to "${group?.name}"`, 
        status: 'success',
        details: `Bulk addition completed. Total group size: ${newCount} recipients.`
      });
    } else if (newCount < oldCount) {
      addActivity(orgId, { 
        type: 'groups', 
        content: `${oldCount - newCount} recipients removed from "${group?.name}"`, 
        status: 'info',
        details: `Manual cleanup performed. Remaining group size: ${newCount} recipients.`
      });
    }
  };

  const updateGroupName = (orgId, groupId, name) => {
    const org = organisations.find(o => o.id === orgId);
    const group = org?.groups.find(g => g.id === groupId);

    setOrganisations(prev => prev.map(org => {
      if (org.id === orgId) {
        return {
          ...org,
          groups: org.groups.map(g => 
            g.id === groupId ? { ...g, name } : g
          )
        };
      }
      return org;
    }));
    if (group && group.name !== name) {
      addActivity(orgId, { 
        type: 'groups', 
        content: `Group "${group.name}" renamed to "${name}"`, 
        status: 'info',
        details: `Previous Name: ${group.name}\nNew Name: ${name}`
      });
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
