import mindmapProcessor from './mindmap_processor.js'

test('Should create tree from indented string', () => {

  var expected = [
    { id: 'Root', name: 'Root', x: 0, y: 0, color: 'steelblue', link: [ ] },
    { id: 'RootChild1', name: 'RootChild1', x: 10, y: 0, color: 'steelblue', link: [ 'Root'  ] },
    { id: 'ChildFrom1_1', name: 'ChildFrom1_1', x: 20, y: -1, color: 'steelblue', link: [ 'RootChild1'  ] },
    { id: 'ChildFrom1_2', name: 'ChildFrom1_2', x: 20, y:  0, color: 'steelblue', link: [ 'RootChild1'  ] },
    { id: 'ChildFrom1_3', name: 'ChildFrom1_3', x: 20, y:  1, color: 'steelblue', link: [ 'RootChild1'  ] },

    { id: 'RootChild2', name: 'RootChild2', x: -10, y: 0, color: 'steelblue', link: [ 'Root'  ] },
    { id: 'ChildFrom2_1', name: 'ChildFrom2_1', x: -20, y: -1, color: 'steelblue', link: [ 'RootChild2'  ] },
    { id: 'ChildFrom2_2', name: 'ChildFrom2_2', x: -20, y:  0, color: 'steelblue', link: [ 'RootChild2'  ] },
    { id: 'ChildFrom2_3', name: 'ChildFrom2_3', x: -20, y:  1, color: 'steelblue', link: [ 'RootChild2'  ] },
  ]

  const input = `
Root
  RootChild1
    ChildFrom1_1
    ChildFrom1_2
    ChildFrom1_3
  RootChild2
    ChildFrom2_1
    ChildFrom2_2
    ChildFrom2_3
`;
  expect(mindmapProcessor(input)).toEqual(expected);
});


test('Should able to divide in rotation of 5 first child', () => {

  var expected = [
    { id: 'Root', name: 'Root', x: 0, y: 0, color: 'steelblue', link: [ ] },
    { id: 'RootChild1', name: 'RootChild1', x:  10, y:  0, color: 'steelblue', link: [ 'Root'  ] },
    { id: 'RootChild2', name: 'RootChild2', x:   3, y:  9, color: 'steelblue', link: [ 'Root'  ] },
    { id: 'RootChild3', name: 'RootChild3', x:  -8, y:  5, color: 'steelblue', link: [ 'Root'  ] },
    { id: 'RootChild4', name: 'RootChild4', x:  -8, y: -5, color: 'steelblue', link: [ 'Root'  ] },
    { id: 'RootChild5', name: 'RootChild5', x:   3, y: -9, color: 'steelblue', link: [ 'Root'  ] },
  ]

  const input = `
Root
  RootChild1
  RootChild2
  RootChild3
  RootChild4
  RootChild5
`;
  expect(mindmapProcessor(input)).toEqual(expected);
});


test('Level 2 above object should set its position relative to its parent', () => {

  var expected = [
    { id: 'Root', name: 'Root', x: 0, y: 0, color: 'steelblue', link: [ ] },
    { id: 'RootChild1', name: 'RootChild1', x:  10, y:  0, color: 'steelblue', link: [ 'Root'  ] },
    { id: 'RootChild2', name: 'RootChild2', x:  20, y:  -1, color: 'steelblue', link: [ 'RootChild1' ] },
    { id: 'Child1', name: 'Child1', x:  30, y:  -2, color: 'steelblue', link: [ 'RootChild2' ] },
    { id: 'Child2', name: 'Child2', x:  30, y:  -1, color: 'steelblue', link: [ 'RootChild2' ] },
    { id: 'Child3', name: 'Child3', x:  30, y:   0, color: 'steelblue', link: [ 'RootChild2' ] },
    { id: 'Child4', name: 'Child4', x:  40, y:   0, color: 'steelblue', link: [ 'Child3' ] },

    { id: 'RootChild3', name: 'RootChild3', x:  20, y:  0, color: 'steelblue', link: [ 'RootChild1' ] },
    { id: 'RootChild4', name: 'RootChild4', x:  30, y: -1, color: 'steelblue', link: [ 'RootChild3' ] },
    { id: 'RootChild5', name: 'RootChild5', x:  30, y:  0, color: 'steelblue', link: [ 'RootChild3' ] },
    { id: 'RootChild6', name: 'RootChild6', x:  30, y:  1, color: 'steelblue', link: [ 'RootChild3' ] },

  ]

  const input = `
Root
  RootChild1
    RootChild2
      Child1
      Child2
      Child3
        Child4
    RootChild3
      RootChild4
      RootChild5
      RootChild6
`;
  expect(mindmapProcessor(input)).toEqual(expected);
});


