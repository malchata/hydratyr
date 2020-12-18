# hydratyr

<div style="display: flex; align-contents: center; align-items: center; justify-content: center;">
  <img src="https://raw.githubusercontent.com/malchata/hydratyr/main/readme-images/hydratyr.svg" alt="hydratyr" width="1003.5138" height="263.6973" style="max-width: 100%; height: auto; display: block;">
</div>
<br>
hydratyr is a proof-of-concept [Preact](https://preactjs.com/) wrapper component that uses the [idle-until-urgent pattern](https://philipwalton.com/articles/idle-until-urgent/) to hydrate its children. It does this by scheduling an idle callback without a deadline to hydrate the component's children, but registers an intersection observer to immediately hydrate the child component if it is in view (and if the idle callback hasn't already ran).

## Why?

[Component hydration](https://reactjs.org/docs/react-dom.html#hydrate) is [an expensive process](https://css-tricks.com/radeventlistener-a-tale-of-client-side-framework-performance/#the-results) that is used on pre-rendered/server-side rendered markup to restore its client-side functionality. When used sparingly, it's not so much of a problem, but when used across many components on the same page, the main thread can take a drubbing.

When used strategically for components below the fold, hydratyr can break up hydration work into smaller tasks, giving the main thread more breathing room on busy pages with lots of hydrated components.

## Installation and usage

hydratyr can be installed in your Preact project like so:

```
npm i hydratyr --save
```

Then you can import and use it in your components:

```javascript
import { Hydratyr } from "hydratyr";
import { ChildComponentToLazilyHydrate } from "Components/ChildComponentToLazilyHydrate";

export const CourteousComponent = props => {
  return (
    <Hydratyr>
      <ChildComponentToLazilyHydrate />
    </Hydratyr>
  )
};
```

## Available props

Other than child components (which are required), hydratyr take one prop:

1. `wrapper`, which is a string of the HTML element you want hydratyr to wrap. Optional, defaults to `"div"`.
2. `observe`, which is a boolean specifying whether an intersection observer should be used to examine component visibility. If you set this to `false`, an intersection observer won't be created. This effectively makes hydratyr go from idle-until-urgent to simply idle. This will reduce overhead, but components will no longer urgently hydrate when they're visible in the viewport. Optional, defaults to `true`.
3. `timeout`, which is an integer specifying a deadline by which the idle callback must run by. If your work is critical enough, you can set a deadline here. Optional, defaults to `undefined`.

## Considerations to make

Some things to think about using this component:

1. Never ever use hydratyr to hydrate above-the-fold or critical components.
2. This is a proof-of-concept. It may break or do unexpected things.
3. It uses a stateful component. It could probably be rewritten to use hooks and avoid the overhead of a stateful component altogether.
4. There is some overhead if `observe` is `true` (which is the default). Consider whether it makes sense to disable the observer in some cases.
5. Layout shifting may occur on hydration. This is something you might have to deal with even if you don't use hydratyr. You may be able to sidestep extra layout work with the [`content-visibility` CSS property](https://web.dev/content-visibility/).

## What about React?

This component should work in React, though I haven't tested it. Preact is largely compatible with Preact, although React uses `createElement` to create elements whereas Preact uses `h`. If you're keen to try it out, you can always grab [the source](https://github.com/malchata/hydratyr/blob/main/src/index.js), drop it into your React project and change the `import`s to grab the necessary stuff from `react` and `react-dom` instead of `preact`. If there's significant interest in this project, I'll see about making it work with React out of the box and writing advice to use `preact/compat` for Preact projects.
