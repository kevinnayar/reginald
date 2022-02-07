import React from 'react';
import './hero.scss';

type HeroProps = { background: string; text: string; color: string };

const Hero = ({ background, text, color }: HeroProps) => (
  <div className="hero" style={{ background }}>
    <div className="hero__inner">
      <h1 style={{ color }}>{text}</h1>
    </div>
  </div>
);

export default Hero;



