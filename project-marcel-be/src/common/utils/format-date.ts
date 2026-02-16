/* eslint-disable prettier/prettier */
export function formatDate(dateText: string) {
  dateText = dateText.replace(/\n.*/, '').trim(); // Remove extra text after newline
  dateText = dateText.split('·')[0].trim(); // Remove text after '·'
  dateText = dateText.replace(/^(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag),\s/, ''); // Remove weekday names
  dateText = dateText.replace(/\d{2}:\d{2}$/, '').trim(); // Remove time part if presente extra text after newline
  dateText = dateText.replace(/\,/, '').trim();

  const monthMap: { [key: string]: number } = {
    'Januar': 1,
    'Februar': 2,
    'März': 3,
    'April': 4,
    'Mai': 5,
    'Juni': 6,
    'Juli': 7,
    'August': 8,
    'September': 9,
    'Oktober': 10,
    'November': 11,
    'Dezember': 12,
    'Jan.': 1,
    'Feb.': 2,
    'Mar.': 3,
    'Apr.': 4,
    'Jun.': 6,
    'Jul.': 7,
    'Aug.': 8,
    'Sep.': 9,
    'Okt.': 10,
    'Nov.': 11,
    'Dez.': 12,
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Sept': 9,
    'Okt': 10,
    'Nov': 11,
    'Dez': 12,
    'mars': 3,
    'mai': 5,
    'janvier': 1,
    'février': 2,
    'avril': 4,
    'juin': 6,
    'juillet': 7,
    'août': 8,
    'septembre': 9,
    'octobre': 10,
    'novembre': 11,
    'décembre': 12,
  };

  // Match YYYY-MM-DD format (ISO)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    return dateText.split('-').reverse().join('/');
  }

  // Match DD.MM.YYYY format
  let match = dateText.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (match) {
    return `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}/${match[3]}`;
  }

  // Match DD/MM/YYYY format
  match = dateText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);

  if (match) {
    return `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}/${match[3]}`;
  }

  // Match DD Month YYYY format
  match = dateText.match(/(\d{1,2})\.?(?:\s|-)?(\w+)\s(\d{4})/);

  if (match) {
    const month = monthMap[match[2]];
    if (month !== undefined) {
      return `${match[1].padStart(2, '0')}/${String(month).padStart(2, '0')}/${match[3]}`;
    }
  }

  // Match DD Month YYYY format
  match = dateText.match(/^(\w{2})\. (\d{2})\. ([A-Za-zäöüÄÖÜ]+) (\d{4})$/);

  if (match) {
    const month = monthMap[match[3]];
    if (month !== undefined) {
      return `${match[2].padStart(2, '0')}/${String(month).padStart(2, '0')}/${match[4]}`;
    }
  }

  // Match DD. Month YYYY format
  match = dateText.match(/^(\d{1,2})\.\s([A-Za-zäöüÄÖÜ]+)\s(\d{4})$/);
  if (match) {
    const month = monthMap[match[2]];
    if (month !== undefined) {
      return `${match[1].padStart(2, '0')}/${String(month).padStart(2, '0')}/${match[3]}`;
    }
  }

  // Match DD. Month YYYY format
  // match = dateText.match(/^(\d{1,2})\.\s([A-Za-zäöüÄÖÜ]+)\s(\d{4})$/);
  match = dateText.match(/^([A-Za-zäöüÄÖÜ]+)\.\s(\d{1,2})\s(\d{4})$/);

  if (match) {
    const month = monthMap[match[1]];
    if (month !== undefined) {
      return `${match[2].padStart(2, '0')}/${String(month).padStart(2, '0')}/${match[3]}`;
    }
  }

  // Match DD. Month. YYYY format
  match = dateText.match(/^(\d{1,2})\.\s([A-Za-zäöüÄÖÜ]+)\.\s(\d{4})$/);

  if (match) {
    const month = monthMap[match[2]];
    if (month !== undefined) {
      return `${match[1].padStart(2, '0')}/${String(month).padStart(2, '0')}/${match[3]}`;
    }
  }

  // Match DD Month YYYY format
  match = dateText.match(/(\d{2})\s([A-Za-zäöüÄÖÜ]+)\s(\d{4})/);

  if (match) {
    const month = monthMap[match[2]];
    if (month !== undefined) {
      return `${match[1].padStart(2, '0')}/${String(month).padStart(2, '0')}/${match[3]}`;
    }
  }

  // Match DD Month YYYY format
  match = dateText.match(/(\d{1,2})[.\s]([A-Za-zäöüÄÖÜéèêôûàçù]+)[.\s](\d{4})/);

  if (match) {
    const month = monthMap[match[2]];
    if (month !== undefined) {
      return `${match[1].padStart(2, '0')}/${String(month).padStart(2, '0')}/${match[3]}`;
    }
  }

  // Match Month DD, YYYY format (e.g., Dez. 19, 2024)
  match = dateText.match(/(\w+)\.?(?:\s|-)?(\d{1,2}),\s(\d{4})/);

  if (match) {
    const month = monthMap[match[1]];
    if (month !== undefined) {
      return `${match[2].padStart(2, '0')}/${String(month).padStart(2, '0')}/${match[3]}`;
    }
  }

  // Match YYYY only (fallback)
  match = dateText.match(/^(\d{4})$/);
  if (match) {
    return `01/01/${match[1]}`; // Default to Jan 1st if only year is given
  }
  return null; // Unable to parse
}

export function parseRelativeDate(relativeDate: string) {
  const regex = /(\d+)\s+(day|month|year)s?\s+ago/;
  const match = relativeDate.match(regex);

  if (match) {
    const value = parseInt(match[1], 10);
    const unit = match[2];

    const today = new Date();

    if (unit === 'day') {
      today.setDate(today.getDate() - value); // Subtract days
    } else if (unit === 'month') {
      today.setMonth(today.getMonth() - value); // Subtract months
    } else if (unit === 'year') {
      today.setFullYear(today.getFullYear() - value); // Subtract years
    }

    return today;
  }

  return null; // Return null if the format is invalid
}

export function parseRelativeDateLinkedIn(relativeDate: string) {
  const regex = /^(\d+)\s*(h|j|sem\.|mois|an?s)$/;
  const match = relativeDate.match(regex);

  if (match) {
    const value = parseInt(match[1], 10);
    const unit = match[2];

    const today = new Date();

    if (unit === 'h') {
      today.setHours(today.getHours() - value); // Subtract days
    } else if (unit === 'j') {
      today.setDate(today.getDate() - value); // Subtract days
    } else if (unit === 'sem.') {
      today.setDate(today.getDate() - value * 7); // Subtract days
    } else if (unit === 'mois') {
      today.setMonth(today.getMonth() - value); // Subtract months
    } else if (unit === 'an(s)') {
      today.setFullYear(today.getFullYear() - value); // Subtract years
    }

    return today;
  }

  return null; // Return null if the format is invalid
}
