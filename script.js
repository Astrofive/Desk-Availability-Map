

// get info on the floor itself 
async function getFloorinfo(floorid) {
    const floorresponse = await fetch(`https://hpe.iofficeconnect.com/external/api/rest/v2/floors/${floorid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-username': 'hpeapitesting',
            'x-auth-password': `${apipassword}`,
        },
    });

    const floordata = await floorresponse.json();
    const buildingCode = floordata.building.code;
    const floorName = floordata.name;

    const buildingInfoText = document.getElementById('buildingInfoText');
    buildingInfoText.textContent = `Info for ${buildingCode} floor ${floorName}:`;
}

// call and processing availability of spaces
async function getAvailability(floorid) {

    const roomsresponse = await fetch(`https://hpe.iofficeconnect.com/external/api/rest/v2/rooms?floorId=${floorid}&limit=2000&includeNonReservable=false&includeReservable=true&selector=anonymousReservations(endDate%2CstartDate)`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-username': 'hpeapitesting',
            'x-auth-password': `${apipassword}`,
        },
    });

    const data = await roomsresponse.json();

    console.log(data);

    // console log desklist
    for (let index in data) {
        console.log(`found desk ${data[index].name}`);

        // add desk name to page
        const deskli = document.createElement('li');
        deskli.textContent = `Desk ${data[index].name}`
        deskli.id = data[index].name;
        const desklist = document.getElementById('desklist');
        desklist.appendChild(deskli);
    }


    // for every desk returned
    for (let index in data) {
        const deskName = data[index].name;

        // if the desk's reservation list is greater than 0, AKA has any reservations
        if (Object.keys(data[index].anonymousReservations).length > 0) {

            console.log(`Reservation(s) for desk ${data[index].name} found`);
            const deskReservations = data[index].anonymousReservations;
            let currentlyReserved = false;

            // list out each reservation for the desk and whether it's CURRENTLY reserved 
            for (let reservationindex in deskReservations) {
                console.log(data[index].anonymousReservations[reservationindex]); 

                const startTime = deskReservations[reservationindex].startDate;
                const endTime = deskReservations[reservationindex].endDate;
                const currenttime = Date.now();

                // determine if we're in the middle of this reservation
                if ((startTime < currenttime) && (endTime > currenttime)) {
                    console.log(`This reservation is currently ongoing`);
                    currentlyReserved = true;
                } else {
                    console.log(`This reservation is currently not ongoing`);
                }
            }
            if (currentlyReserved == true){
                document.getElementById(`${deskName}`).classList.add('unavailable');
            } else {
                document.getElementById(`${deskName}`).classList.add('available-reservation-at-other-time-today');
            }
        } else {
            document.getElementById(`${deskName}`).classList.add('available-no-reservations-today');
        }
      }

}

const goButton = document.getElementById('run');
goButton.addEventListener('click', () => {

    // kills all children. I promise it's not what it sounds like.
    const desklist = document.getElementById('desklist');
    while (desklist.firstChild) {
        desklist.removeChild(desklist.firstChild);
    }

    const floorid = document.getElementById('floorid').value;
    getAvailability(floorid);
    getFloorinfo(floorid);
});




