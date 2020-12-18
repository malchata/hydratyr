# hydratyr

<div style="display: flex; align-contents: center; align-items: center; justify-content: center;">
  <img src="https://raw.githubusercontent.com/malchata/hydratyr/main/readme-images/hydratyr.svg" alt="hydratyr" width="1003.5138" height="263.6973" style="max-width: 100%; height: auto; display: block;">
</div>

hydratyr is a proof-of-concept Preact wrapper component that uses the [idle-until-urgent pattern](https://philipwalton.com/articles/idle-until-urgent/) to hydrate its children. It does this by scheduling an idle callback without a deadline to hydrate the component's children, but registers an intersection observer to immediately hydrate the child component if it is in view (and if the idle callback hasn't already ran).

## Why?

[Component hydration](https://reactjs.org/docs/react-dom.html#hydrate) is [an expensive process](https://css-tricks.com/radeventlistener-a-tale-of-client-side-framework-performance/#the-results) that is used on pre-rendered/server-side rendered markup to restore its client-side functionality. When used sparingly, it's not so much of a problem, but when used across many components on the same page, the main thread can take a drubbing.



## Installation and usage

Installation is the usual thing
