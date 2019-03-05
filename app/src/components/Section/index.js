import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const renderTitle = title => title ?
  <h4 className="title">{ title }</h4> :
  null;

const Container = ({
  children,
  stretch
}) => {
  return !stretch ?
    <div className="container">{ children }</div> :
    <div>{ children }</div>;
};

Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  stretch: PropTypes.bool
};

const Section = ({
  anchor,
  background,
  backgroundImage,
  backgroundSize,
  children,
  color,
  stretch,
  style,
  title
}) => {
  const inlineStyles = {
    background,
    backgroundImage: backgroundImage && `url(${backgroundImage})`,
    backgroundSize,
    color,
    ...style
  };

  return <section id={ anchor } name={ anchor } className="section-component" style={ inlineStyles }>
    <Container stretch={ stretch }>
      { renderTitle(title) }
      { children }
    </Container> 
  </section>;
};

Section.defaultProps = {
  background: 'transparent',
  color: '#555'
};

Section.propTypes = {
  anchor: PropTypes.string,
  background: PropTypes.string,
  backgroundImage: PropTypes.string,
  backgroundSize: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  color: PropTypes.string,
  stretch: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string
};

export default Section;
