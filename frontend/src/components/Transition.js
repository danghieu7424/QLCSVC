import React, { useContext, useRef } from 'react';
import { SwitchTransition, Transition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

import TransitionContext from '../context/TransitionContext';

const TransitionComponent = ({ children }) => {
  const location = useLocation();
  const { toggleCompleted } = useContext(TransitionContext);
  const nodeRef = useRef(null);

  return (
    <SwitchTransition>
      <Transition
        key={location.pathname}
        timeout={500}
        nodeRef={nodeRef}
        onEnter={() => {
          const node = nodeRef.current;
          if (!node) return;

          toggleCompleted(false);
          gsap.set(node, { autoAlpha: 0, scale: 0.8, xPercent: -100 });
          gsap
            .timeline({
              paused: true,
              onComplete: () => toggleCompleted(true),
            })
            .to(node, { autoAlpha: 1, xPercent: 0, duration: 0.25 })
            .to(node, { scale: 1, duration: 0.25 })
            .play();
        }}
        onExit={() => {
          const node = nodeRef.current;
          if (!node) return;

          gsap
            .timeline({ paused: true })
            .to(node, { scale: 0.8, duration: 0.2 })
            .to(node, { xPercent: 100, autoAlpha: 0, duration: 0.2 })
            .play();
        }}
      >
        {/* Đảm bảo children là 1 element DOM thực sự */}
        <div ref={nodeRef} style={{ width: '100%' }}>
          {children}
        </div>
      </Transition>
    </SwitchTransition>
  );
};

export default TransitionComponent;
