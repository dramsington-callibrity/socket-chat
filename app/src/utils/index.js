import Scroll, { scroller } from 'react-scroll';

export const scroll = Scroll.animateScroll;
export const scrollTo = element => {
  scroller.scrollTo(element, {
    offset: -56,
    duration: 500,
    delay: 0,
    smooth: 'easeInOutQuart'
  });
};

export const getSocketData = msg => {
  const data = JSON.parse(msg.data);

  if (data.content !== undefined) {
    return {
      ...data,
      content: JSON.parse(data.content)
    };
  }

  return data;
}
