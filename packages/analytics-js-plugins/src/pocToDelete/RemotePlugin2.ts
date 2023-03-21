import { effect } from '@preact/signals-core';

const getExposedGlobal = (keyName: string): any => {
  if (!(window as any).RudderStackGlobals) {
    (window as any).RudderStackGlobals = {} as any;
    return undefined;
  }

  return (window as any).RudderStackGlobals[keyName];
};

const RemotePlugin2 = () => ({
  name: 'remoteTest2',
  remote: {
    test(data: any[], cb: (data: any[]) => void) {
      console.log('state in remote plugin2', getExposedGlobal('state'));
      const state = getExposedGlobal('state');
      const newData = [...data];
      newData.push('item from remote plugin2');
      cb(newData);

      effect(() => {
        console.log('local state in remote plugin2: ', state.globalLocalState.value);

        // Whenever this effect is triggered, increase `counter`.
        // But we don't want this signal to react to `remoteState` changes
        const nextState = {
          ...state.remoteState.peek(),
        };
        nextState.counter += 1;
        state.remoteState.value = nextState;
      });

      effect(() => {
        console.log('remote state in remote plugin2: ', state.remoteState.value);
      });
    },
  },
});

export default RemotePlugin2;
