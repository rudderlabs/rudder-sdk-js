export default function ({ types: t }) {
  return {
    visitor: {
      ClassMethod(path) {
        if (path.node.accessibility === 'private') {
          path.node.key.name = `private_${path.node.key.name}`;
        }
      },
      ClassProperty(path) {
        if (path.node.accessibility === 'private') {
          path.node.key.name = `private_${path.node.key.name}`;
        }
      },
    },
  };
}
