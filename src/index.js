// Vendors
import { h, hydrate, Component } from "preact";
import PropTypes from "prop-types";

export class Hydratyr extends Component {
  constructor (props) {
    super(props);

    this.isBrowser = typeof window !== "undefined";
    this.idleCallbackSupport = this.isBrowser && "requestIdleCallback" in window;
    this.observe = "observe" in props ? props.observe : true;
    this.timeout = "timeout" in props ? Number(props.timeout) : undefined;
    this.state = {
      hydrated: !this.isBrowser
    };
    this.children = props.children;

    // The callback to render the component. This may be invoked either in
    // requestIdleCallback, or within the intersection observer.
    this.renderCallback = () => {
      if (!this.state.hydrated) {
        hydrate(this.children, this.root);

        this.setState({
          hydrated: true
        }, () => {
          // Whether the observer kicks off the rendering or the idle callback
          // does, it's necessary to run this just in case.
          if (this.observe) {
            this.cleanupObserver();
          }
        });
      }
    };

    this.cleanupObserver = () => {
      if (this.isBrowser && this.state.hydrated) {
        this.idleElementObserver.unobserve(this.root);
        this.idleElementObserver.disconnect();
      }
    };

    this.createObserver = () => {
      if (this.isBrowser && !this.state.hydrated) {
        this.idleElementObserver = new IntersectionObserver(([ entry ]) => {
          if ((entry.isIntersecting || entry.intersectionRatio) && !this.state.hydrated) {
            if (this.idleCallbackSupport && typeof this.idleCallback !== "undefined") {
              cancelIdleCallback(this.idleCallback);
            }

            this.renderCallback();
          }
        });

        this.idleElementObserver.observe(this.root);
      }
    };

    // Creates the idle callback. Also optionally creates the intersection
    // observer if the idle callback hasn't already immediately ran.
    this.fireIdleCallback = () => {
      if (this.idleCallbackSupport) {
        if (typeof this.timeout !== undefined) {
          this.idleCallback = requestIdleCallback(this.renderCallback, this.timeout);
        } else {
          this.idleCallback = requestIdleCallback(this.renderCallback);
        }

        if (this.observe) {
          this.createObserver();
        }

        return;
      }

      // Render immediately if requestIdleCallback isn't available
      this.renderCallback();
    };
  }

  componentDidMount () {
    this.fireIdleCallback();
  }

  render (props) {
    const ElementType = props.wrapper || "div";

    if (!this.isBrowser) {
      return <ElementType {...props}>{this.children}</ElementType>;
    }

    return <ElementType dangerouslySetInnerHTML={{}} ref={root => this.root = root} {...props}></ElementType>;
  }
}

Hydratyr.propTypes = {
  children: PropTypes.node.isRequired,
  wrapper: PropTypes.string,
  observe: PropTypes.bool,
  timeout: PropTypes.number
};
