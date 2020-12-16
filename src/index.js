// Vendors
import React from "react";
import { hydrate } from "react-dom";
import PropTypes from "prop-types";

export class Hydratyr extends React.Component {
  constructor (props) {
    super(props);

    this.isBrowser = typeof window !== "undefined";
    this.callback = props.callback;
    this.callbackArgs = props.callbackArgs || [];
    this.state = {
      hydrated: !this.isBrowser
    };
    this.children = props.children;
  }

  componentDidMount () {
    this.fireIdleCallback();
    this.createObserver();
  }

  renderCallback () {
    if (!this.state.hydrated) {
      hydrate(this.children, this.idleElementContainer);

      if (typeof this.callback !== "undefined") {
        this.callback(...this.callbackArgs);
      }

      this.setState({
        hydrated: true
      }, () => {
        this.cleanupObserver(this.idleElementContainer);
      });
    }
  }

  createObserver () {
    if (this.isBrowser && !this.state.hydrated) {
      this.idleElementObserver = new IntersectionObserver(([ entry ]) => {
        if (entry.isIntersecting || entry.intersectionRatio) {
          this.renderCallback();
        }
      });

      this.idleElementObserver.observe(this.idleElementContainer);
    }
  }

  cleanupObserver () {
    if (this.state.hydrated && typeof this.idleElementObserver !== "undefined") {
      this.idleElementObserver.unobserve(this.idleElementContainer);
      this.idleElementObserver.disconnect();
    }
  }

  fireIdleCallback () {
    if (this.isBrowser && "requestIdleCallback" in window) {
      this.idleCallback = requestIdleCallback(this.renderCallback);

      return;
    }

    this.renderCallback();
  }

  render (props) {
    const ElementType = props.wrapper || "div";

    return (
      <ElementType dangerouslySetInnerHTML={{}} ref={idleElementContainer => this.idleElementContainer = idleElementContainer}>
        {this.isBrowser ? "" : this.children}
      </ElementType>
    );
  }
}

Hydratyr.propTypes = {
  children: PropTypes.node.isRequired,
  callback: PropTypes.func,
  callbackArgs: PropTypes.array,
  wrapper: PropTypes.string
};
