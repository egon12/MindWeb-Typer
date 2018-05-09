import PositionCalculator from './position_calculator'

test('createScale_same_x_same_y', () => {

    const data = [
        { id: "1", x: 1, y: 2 },
        { id: "2", x: 1, y: 2 },
        { id: "3", x: 1, y: 2 }
    ];

    const config = {
        container: { width: 100, height: 100 },
        rect: { width: 10, height: 10 }
    }

    const ps = new PositionCalculator()

    const scale = ps.createScale(data, config)

    expect(scale.x(1)).toBe(45)
    expect(scale.y(2)).toBe(45)
})

test('createScale_3_region_x_4_region_y', () => {

    const data = [
        { id: "1", x: 1, y: 4 },
        { id: "2", x: 2, y: 5 },
        { id: "3", x: 3, y: 7 }
    ];

    const config = {
        container: { width: 100, height: 100 },
        rect: { width: 10, height: 10 }
    }

    const ps = new PositionCalculator()

    const scale = ps.createScale(data, config)

    expect(scale.x(1)).toBe(0)
    expect(scale.x(2)).toBe(45)
    expect(scale.x(3)).toBe(90)

    expect(scale.y(1)).toBe(0)
    expect(scale.y(2)).toBe(0)
    expect(scale.y(3)).toBe(0)
    expect(scale.y(4)).toBe(0)
    expect(scale.y(5)).toBe(30)
    expect(scale.y(6)).toBe(60)
    expect(scale.y(7)).toBe(90)

})

test('createScale_with_input_char', () => {

    const data = [
        { id: "1", x: 1, y: "4" },
        { id: "2", x: 2, y: 5 },
        { id: "3", x: "3", y: 7 }
    ];

    const config = {
        container: { width: 100, height: 100 },
        rect: { width: 10, height: 10 }
    }

    const ps = new PositionCalculator()

    const scale = ps.createScale(data, config)

    expect(scale.x(3)).toBe(90)
    expect(scale.x("3")).toBe(90)

    expect(scale.y(4)).toBe(0)
    expect(scale.y("4")).toBe(0)

})


test('create position', () => {

    const data = [
        { id: "1", x: 1, y: 4 },
        { id: "2", x: 2, y: 5 },
        { id: "3", x: 3, y: 7 }
    ];

    const config = {
        container: { width: 100, height: 100 },
        rect: { width: 10, height: 10 }
    }

    const ps = new PositionCalculator()

    const scale = ps.createScale(data, config)
    const dataWithPosition = ps.calculateNodePosition(data, config)

    dataWithPosition.forEach( d => {
        expect(d.r_x).toBe(scale.x(d.x))
        expect(d.r_y).toBe(scale.y(d.y))
    })

})

test("create connection", () => {
    const data = [
        { id: "1", x: 1, y: 4, link: ["2", "3"] },
        { id: "2", x: 2, y: 5, link: ["3"] },
        { id: "3", x: 3, y: 7 }
    ];

    const config = {
        container: { width: 100, height: 100 },
        rect: { width: 10, height: 10 }
    }

    const ps = new PositionCalculator()
    const dataWithPosition = ps.calculateNodePosition(data, config)
    const edges = ps.calculateEdgePoints(dataWithPosition, config)
    console.log(edges)
})

