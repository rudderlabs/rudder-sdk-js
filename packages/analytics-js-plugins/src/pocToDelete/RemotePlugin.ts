import { effect } from '@preact/signals-core';

const getExposedGlobal = (keyName: string): any => {
  if (!(window as any).RudderStackGlobals) {
    (window as any).RudderStackGlobals = {} as any;
    return undefined;
  }

  return (window as any).RudderStackGlobals[keyName];
};

const RemotePlugin = () => ({
  name: 'remoteTest',
  remote: {
    test(data: any[], cb: (data: any[]) => void) {
      console.log('state in remote plugin', getExposedGlobal('state'));
      const state = getExposedGlobal('state');
      const newData = [...data];
      newData.push('item from remote plugin');
      cb(newData);

      effect(() => {
        console.log('local state in remote plugin: ', state.globalLocalState.value);

        // Whenever this effect is triggered, increase `counter`.
        // But we don't want this signal to react to `remoteState` changes
        const nextState = {
          ...state.remoteState.peek(),
        };
        nextState.counter += 1;
        state.remoteState.value = nextState;
      });

      effect(() => {
        console.log('remote state in remote plugin: ', state.remoteState.value);
      });
    },
  },
});

export default RemotePlugin;
