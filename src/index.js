// Vendors
import React from "react";
import { hydrate } from "react-dom";
import PropTypes from "prop-types";

export class Hydratyr extends React.Component {
  constructor (props) {
    super(props);

    this.isBrowser = typeof window !== "undefined";
    this.idleCallbackSupport = this.isBrowser && "requestIdleCallback" in window;
    this.state = {
      hydrated: !this.isBrowser
    };
    this.children = props.children;
    this.wrapper = props.wrapper || "div";

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
          this.cleanupObserver();
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
        this.idleCallback = requestIdleCallback(this.renderCallback);
        this.createObserver();

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
    const ElementType = this.wrapper;

    if (!this.isBrowser) {
      return <ElementType {...props}>{this.children}</ElementType>;
    }

    return <ElementType dangerouslySetInnerHTML={{}} ref={root => this.root = root} {...props}></ElementType>;
  }
}

Hydratyr.propTypes = {
  children: PropTypes.node.isRequired,
  wrapper: PropTypes.string
};
