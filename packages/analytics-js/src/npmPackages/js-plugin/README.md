# Overview

Web applications are becoming more and more complicated nowadays. To separate concerns, decouple
business logic, a large application should be well designed. One of best practices is plugin based
architecture. Whenever you add a new feature, it should not add much complication to the system so
that the project could be always maintainable when it grows.

Every plugin in the system maybe not bundled separately but just a logical plugin.

# Extension Points

From above two examples, we have seen how extension points work. It's pretty simple with two parts:

1. Define/use extension point in an extensible module/component.
2. Define plugin object structure following the extension point.

There isn't any central registry to declare extension points but whenever you need to make some
logic extensible, you use `plugin.invoke(extPoint)` or `plugin.getPlugins(extPoint)` to get all
plugins which contributes to the extension point.

An extension point is just a string that represents the plugin object structure separated by `.`.

For example, when we make `Menu` component extensible, we use below code:

```js
const menuItems = [];
plugin.invoke('menu.processMenuItems', menuItems);
// render menuItems to UI...
```

Then `menuItems` array can be filled by all plugins which contribute to `menu.processMenuItems`.

Below is how plugin consume the extension point:

```js
plugin.registry({
  name: 'samplePlugin',
  menu: {
    processMenuItems(items) {
      items.push({ label: 'label', link: 'hello/sample' });
    },
  },
});
```

Not only application itself but also every plugin could define extension point.

Extension point is usually a method, but could be also just some value. It depends on how extension
point provider uses it.

# Plugin

Every plugin is just a JavaScript object, normally every path to leaf property means it contribute
some extension point. Like above example:

```js
const myPlugin = {
  name: 'samplePlugin',
  menu: {
    processMenuItems(items) {
      items.push({ label: 'label', link: 'hello/sample' });
    },
  },
};
```

It defines a plugin named `samplePlugin` and contribute to the extension point `menu.processMenuItems`.

The only mandatory field is `name` which should be unique in an application.

## Plugin Dependency

Every plugin could declare its dependencies by `deps` property:

```js
const myPlugin = {
  name: 'myPlugin',
  deps: ['plugin1', 'plugin2'],
};
```

`deps` property does two things:

1. Plugin extension points are executed after its deps when call `plugin.invoke` or `plugin.getPlugins`
2. If some deps don't exist, then the plugin is also not loaded.

# API Reference

### plugin.register(p)

Register a plugin to the system. Normally you should register all plugins before your app is
started. If you want to dynamically register plugin on demand, you need to ensure all extension
points executed again. For example, you may want to `Menu` component force updated when new plugin
registered.

### plugin.unregister(name)

Unregister a plugin. You may also need to ensure all UI re-rendered if necessary yourself.

### plugin.getPlugin(name)

Get the plugin instance by name. If your plugin want to export some reusable utilities or API to
other plugins, you can define it in plugin object, then other plugin can use `getPlugin` to get the
plugin object and call its API.

### plugin.getPlugins(extPoint)

Get all plugins that contributes to the extension point.

### plugin.invoke(extPoint, ...args)

Call extension point method from all plugins which support it and returns an array which contains
all return value from extension point function.

For example:

```js
plugin.registery({
  name: 'p1',
  getMenuItem() {
    return 'item1';
  },
});
plugin.registery({
  name: 'p2',
  getMenuItem() {
    return 'item2';
  },
});
plugin.registery({
  name: 'p3',
  getMenuItem() {
    return 'item3';
  },
});

const items = plugin.invoke('getMenuItem');
// items: ['p1', 'p2', 'p3']
```

If extension point is not a function, then use the value as return value. If you don't want to call
the extension point but just collect all functions, you can use prefix the extension point
with `!`, for example:

```js
plugin.registery({ name: 'p1', rootComponent: () => <div>Hello</div>)
plugin.registery({ name: 'p2', rootComponent: () => <div>Hello2</div>)
const rootComponents = plugin.invoke('!rootComponent');
// rootComponents: [func1, func2]
```

This is useful if you want to contribute React component to some extension point.
