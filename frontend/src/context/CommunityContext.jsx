import React, { createContext, useContext, useState } from 'react';

const CommunityContext = createContext();

const PREDEFINED_TAGS = [
  { id: 'scheduler', label: '#scheduler', color: '#3b82f6' },
  { id: 'automation', label: '#automation', color: '#8b5cf6' },
  { id: 'feature', label: '#feature', color: '#10b981' },
  { id: 'bug', label: '#bug', color: '#ef4444' },
  { id: 'compose', label: '#compose', color: '#f59e0b' },
  { id: 'guide', label: '#guide', color: '#6366f1' },
  { id: 'groups', label: '#groups', color: '#14b8a6' },
];

const MOCK_USER = {
  id: 'u1',
  name: 'John Doe',
  avatar: 'JD',
  role: 'User' // Not Admin
};

const MOCK_THREADS = [
  {
    id: 't1',
    title: 'How to chain multiple schedules together?',
    content: 'I want to send a sequence of emails where the second email triggers only if the first one was opened. Is there a built-in way to do this with the current scheduler?',
    author: { id: 'u2', name: 'Sarah Smith', avatar: 'SS' },
    type: 'DISCUSSION',
    tags: ['scheduler', 'automation'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    helpfulCount: 12,
    isHelpful: false,
    isSolved: true,
    isBookmarked: false,
    replies: [
      {
        id: 'r1',
        content: 'Yes! You can set up a conditional rule in the Automation tab of your Compose Workspace.',
        author: { id: 'u3', name: 'Mike Johnson', avatar: 'MJ' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        helpfulCount: 5,
        isHelpful: false
      }
    ]
  },
  {
    id: 't2',
    title: 'Feature request: Dark mode for the email composer',
    content: 'The dashboard is great, but the email composer is very bright. Can we get a dark mode option specifically for the compose workspace?',
    author: { id: 'u4', name: 'Alex Wong', avatar: 'AW' },
    type: 'FEATURE REQUEST',
    tags: ['feature', 'compose'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    helpfulCount: 45,
    isHelpful: true,
    isSolved: false,
    isBookmarked: true,
    replies: []
  }
];

export const CommunityProvider = ({ children }) => {
  const [threads, setThreads] = useState(MOCK_THREADS);
  const [currentUser] = useState(MOCK_USER);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [sortBy, setSortBy] = useState('Latest'); // Latest, Popular, Solved, Unanswered, Bookmarked

  const addThread = (title, content, selectedTagIds) => {
    const newThread = {
      id: `t${Date.now()}`,
      title,
      content,
      author: currentUser,
      type: 'DISCUSSION', // default for new threads
      tags: selectedTagIds,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      isHelpful: false,
      isSolved: false,
      isBookmarked: false,
      replies: []
    };
    setThreads(prev => [newThread, ...prev]);
  };

  const addReply = (threadId, content) => {
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          replies: [...thread.replies, {
            id: `r${Date.now()}`,
            content,
            author: currentUser,
            createdAt: new Date().toISOString(),
            helpfulCount: 0,
            isHelpful: false
          }]
        };
      }
      return thread;
    }));
  };

  const toggleHelpful = (threadId) => {
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          isHelpful: !thread.isHelpful,
          helpfulCount: thread.isHelpful ? thread.helpfulCount - 1 : thread.helpfulCount + 1
        };
      }
      return thread;
    }));
  };

  const toggleBookmark = (threadId) => {
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          isBookmarked: !thread.isBookmarked
        };
      }
      return thread;
    }));
  };

  const toggleSolved = (threadId) => {
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          isSolved: !thread.isSolved
        };
      }
      return thread;
    }));
  };

  const toggleReplyHelpful = (threadId, replyId) => {
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          replies: thread.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                isHelpful: !reply.isHelpful,
                helpfulCount: reply.isHelpful ? reply.helpfulCount - 1 : reply.helpfulCount + 1
              };
            }
            return reply;
          })
        };
      }
      return thread;
    }));
  };

  // Derived state for filtering and sorting
  let filteredThreads = [...threads];

  if (searchQuery) {
    filteredThreads = filteredThreads.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (activeTags.length > 0) {
    filteredThreads = filteredThreads.filter(t => activeTags.every(tag => t.tags.includes(tag)));
  }

  if (sortBy === 'Popular') {
    filteredThreads.sort((a, b) => b.helpfulCount - a.helpfulCount);
  } else if (sortBy === 'Latest') {
    filteredThreads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'Solved') {
    filteredThreads = filteredThreads.filter(t => t.isSolved);
  } else if (sortBy === 'Unanswered') {
    filteredThreads = filteredThreads.filter(t => t.replies.length === 0);
  } else if (sortBy === 'Bookmarked') {
    filteredThreads = filteredThreads.filter(t => t.isBookmarked);
  }

  const value = {
    threads: filteredThreads,
    allThreads: threads, // For stats
    predefinedTags: PREDEFINED_TAGS,
    currentUser,
    searchQuery,
    setSearchQuery,
    activeTags,
    setActiveTags,
    sortBy,
    setSortBy,
    addThread,
    addReply,
    toggleHelpful,
    toggleBookmark,
    toggleSolved,
    toggleReplyHelpful
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
