test("test)", () => {
    expect(1+2).toBe(3);
});

// const { translateCanvasCoordsToReal } = require('../src/index');

// it('should handle canvas click and translate coordinates correctly', () => {
//   // Mock the canvas getBoundingClientRect method
//   canvas.getBoundingClientRect = jest.fn(() => ({
//     left: 10,
//     top: 10
//   }));

//   // Mock the event with clientX and clientY
//   const mockEvent = {
//     clientX: 300,
//     clientY: 300
//   };

//   canvas.dispatchEvent(new MouseEvent('click', mockEvent));

//   const translatedCoords = translateCanvasCoordsToReal(mockEvent.clientX, mockEvent.clientY);

//   const expectedX = 0; 
//   const expectedY = 0;
//   expect(translatedCoords).toEqual({ x: expectedX, y: expectedY });
// });
