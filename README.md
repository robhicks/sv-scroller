# SV-SCROLLER
Yet another Angular 1.x virtual scroller

# Why?

I needed an Angular 1.x virtual scroller that:
- works in vertical, horizontal and grid modes;
- can scroll to the beginning, end or any arbitrary point of the collection; and
- is fast enough while also easy enough to understand.

I also wanted to get more experience with es2015 and building an es5 library.

# Prerequisites

Angular 1.4x or 1.5x.

# Use

The library is not fancy. It is centered around a single Angular 1.x element directive. The html for the directive looks like this:

```Javascript
<sv-scroller id="vertical" iterator="'item'" collection="MC.items" item-height="30" mode="'vertical'">
  <div>{{item.id}}</div>
</sv-scroller>
```

The containing element must have a fixed size. The library does not yet support resize events.

Directive attributes include:

- collection: This has to be an array.
- h: This is optional. If supplied, the directive will adjust its height to this size in pixels.
- id: Include an id as a name spacing facilitator. If you don't care about being able to use the accompanying service to do things, don't worrry about this.
- item-height: This is the height of a single element in vertical and grid mode. It is required for both of those modes.
- item-width: This is the width of a single element in horizontal and grid mode. It is required in horizontal and grid modes.
- iterator: String name that will be used to iterate the collection. This must be a string (note the single quotes).
- mode: The mode can be 'vertical', 'horizontal' or 'grid'. Elements in vertical mode have a fixed height. Elements in horizontal mode have a fixed width. Elements in grid mode have a fixed height and width.
- w: This is optional. If supplied, the directive will adjust its width to this size in pixels.

A horizontal directive might look like this:

```Javascript
<sv-scroller id="horizontal" iterator="'item'" collection="MC.items" item-width="100" h="100" mode="'horizontal'">
  <div>{{item.id}}</div>
</sv-scroller>
```

And a grid directive might look like this:

```Javascript
<sv-scroller id="grid" iterator="'item'" collection="MC.items" item-height="64" item-width="64" mode="'grid'">
  <div>{{item.id}}</div>
</sv-scroller>
```

I don't like Angular watchers or listeners so the library only supports one. It watches the collection and reinitializes when it changes.

Still, I wanted the library to be able to react to certain things, like being requested to go to the beginning, end or some point in the grid, or to load additional members of the collection. For examples to see how to do so, look at the index.html file.

# Development

The project uses gulp 4. The default task builds a minified and un-minified version of the library using [browserify](http://browserify.org/) and [Babel](https://babeljs.io/) v.6.

I use [indexzero's http-server](https://github.com/indexzero/http-server) for development testing.
