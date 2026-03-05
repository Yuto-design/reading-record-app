import { useInView } from '../hooks/useInView';

function RevealOnScroll({ children, className = '', as: Component = 'div', ...props }) {
  const [ref, isInView] = useInView({ threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  return (
    <Component
      ref={ref}
      className={`home-reveal ${isInView ? 'home-reveal--visible' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export default RevealOnScroll;
