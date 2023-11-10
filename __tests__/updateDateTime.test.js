const { updateDateTime } = require("../src/index");
const $ = require("jquery");

test("Check date-time", () => {
    // Set up our document body
    document.body.innerHTML = `
      <span id="date">12345</span>,
      <span id="time"></span>
      <span id="date-mobile"></span>,
      <span id="time-mobile"></span>
  `;
  
    // Use Jest's timer mocks to set the date and time
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(Date.UTC(2023, 0, 1, 12, 0, 0)));

    // Call the function that updates the DOM
    updateDateTime();

    // Get the date and time string as would be displayed by updateDateTime
    const utcDate = new Date().toUTCString();
    const dateString = utcDate.slice(0, 16); // 'Sun, 01 Jan 2023'
    const timeString = utcDate.slice(17, 25); // '12:00:00'

    expect($("#date").text()).toBe(dateString);
    expect($("#time").text()).toBe(timeString);
    expect($("#date-mobile").text()).toBe(dateString);
    expect($("#time-mobile").text()).toBe(timeString);

    // Clear Jest timers after the test
    jest.useRealTimers();
});
