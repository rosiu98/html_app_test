const formatter = new Intl.DateTimeFormat( 'pl', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
} );


export default formatter