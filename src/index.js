import React from "react";

export default class IdleUntilRender extends React.Component {
  constructor (props) {
    super(props);

    this.isBrowser = typeof window !== "undefined";
    this.idleElementObserver = null;
    this.idleCallback = null;
    this.state = {
      rendered: !this.isBrowser
    };

    if (this.isBrowser && !this.state.rendered) {
      this.idleElementObserver = new IntersectionObserver(([ entry ]) => {
        if (entry.isIntersecting || entry.intersectionRatio) {
          cancelIdleCallback(this.idleCallback);
          this.cleanupObserver(this.idleElementContainer);
        }
      });
    }
  }

  cleanupObserver () {
    if (this.isBrowser && this.state.rendered && this.idleElementObserver !== null) {
      this.idleElementObserver.unobserve(this.idleElementContainer);
      this.idleElementObserver.disconnect();
    }
  }

  componentDidMount () {
    if (this.isBrowser && !this.state.rendered && this.idleElementObserver !== null) {
      this.idleElementObserver.observe(this.idleElementContainer);
    }
  }

  render ({ children }) {
    return (
      <div ref={idleElementContainer => this.idleElementContainer = idleElementContainer}>
        {this.idleCallback = requestIdleCallback(() => <children />)}
      </div>
    );
  }
}
