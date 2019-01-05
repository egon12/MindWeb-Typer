import treeMiddleware from './tree_middleware'
import CircularCalculator from './circular_calculator'

export default function mindmapProcessor(inputString) {

  const tree = treeMiddleware(inputString)

  const cc = new CircularCalculator()

  const newTree = cc.addRadians(tree)

  makePos2(newTree, 0)

  return makeTreeToFlat(newTree)
}

function makeTreeToFlat(tree) {

  const { id, x, y, parentId, children } = tree

  const link = parentId ? [parentId] : []

  var list = [{ id: id, name: id, x, y, color: 'steelblue', link }]

  for (let i=0; i<children.length; i++) {
    list = list.concat(makeTreeToFlat(children[i]))
  }

  return list
}

function makePos2(tree, level) {
  if (level == 0) {
    tree.x = 0
    tree.y = 0
  } else {
    tree.x = Math.cos(tree.radians) * 10 * level
    tree.y = Math.sin(tree.radians) * 10 * level
  }
  tree.children.forEach(c => makePos2(c, level+1))
}

