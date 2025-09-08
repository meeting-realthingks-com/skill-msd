import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

// Date formatting utilities
export const dateFormatters = {
  /**
   * Format date to readable string (e.g., "Jan 15, 2024")
   */
  formatDate(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return isValid(dateObj) ? format(dateObj, 'MMM dd, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  },

  /**
   * Format date with time (e.g., "Jan 15, 2024 at 2:30 PM")
   */
  formatDateTime(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return isValid(dateObj) ? format(dateObj, 'MMM dd, yyyy \'at\' h:mm a') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  },

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  formatRelativeTime(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return isValid(dateObj) ? formatDistanceToNow(dateObj, { addSuffix: true }) : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  },

  /**
   * Format date for form inputs (YYYY-MM-DD)
   */
  formatForInput(date: string | Date): string {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return isValid(dateObj) ? format(dateObj, 'yyyy-MM-dd') : '';
    } catch {
      return '';
    }
  }
};

// Text formatting utilities
export const textFormatters = {
  /**
   * Capitalize first letter of each word
   */
  titleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },

  /**
   * Convert text to sentence case
   */
  sentenceCase(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },

  /**
   * Truncate text with ellipsis
   */
  truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  },

  /**
   * Convert camelCase/PascalCase to readable text
   */
  humanize(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  },

  /**
   * Generate initials from full name
   */
  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }
};

// Number formatting utilities
export const numberFormatters = {
  /**
   * Format number with commas (e.g., 1,234)
   */
  formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
  },

  /**
   * Format percentage (e.g., 75.5%)
   */
  formatPercentage(value: number, decimals = 1): string {
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * Format file size (e.g., 1.5 MB)
   */
  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
};

// Status formatting utilities
export const statusFormatters = {
  /**
   * Get status color class
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: 'text-green-600 bg-green-50',
      inactive: 'text-red-600 bg-red-50',
      pending: 'text-yellow-600 bg-yellow-50',
      approved: 'text-green-600 bg-green-50',
      rejected: 'text-red-600 bg-red-50',
      draft: 'text-gray-600 bg-gray-50',
      completed: 'text-blue-600 bg-blue-50',
      'on_hold': 'text-orange-600 bg-orange-50'
    };
    
    return colors[status] || 'text-gray-600 bg-gray-50';
  },

  /**
   * Format status for display
   */
  formatStatus(status: string): string {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
};