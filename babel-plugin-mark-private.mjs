function renamePrivateMember(t, node) {
  if (node.accessibility === 'private') {
    if (t.isIdentifier(node.key)) {
      node.key.name = `private_${node.key.name}`;
    } else if (t.isStringLiteral(node.key)) {
      node.key.value = `private_${node.key.value}`;
    }
    // Handle other cases if necessary
  }
}

export default function ({ types: t }) {
  return {
    visitor: {
      ClassMethod(path) {
        renamePrivateMember(t, path.node);
      },
      ClassProperty(path) {
        renamePrivateMember(t, path.node);
      },
    },
  };
}
