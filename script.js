console.log(Date.now());

async function getAvailability() {

    const response = await fetch(`https://hpe.iofficeconnect.com/external/api/rest/v2/rooms?floorId=553&includeNonReservable=false&includeReservable=true&selector=anonymousReservations(endDate%2CstartDate)`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-username': 'hpeapitesting',
            'x-auth-password': `${apipassword}`,
        },
    });

    const data = await response.json();

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

        // if the desk's reservation list is greater than 0, AKA has any reservations
        if (Object.keys(data[index].anonymousReservations).length > 0) {

            console.log(`Reservation(s) for desk ${data[index].name} found`);
            const deskReservations = data[index].anonymousReservations;

            // list out each reservation for the desk and whether it's CURRENTLY reserved 
            for (let reservationindex in deskReservations) {
                console.log(data[index].anonymousReservations[reservationindex]); 

                const startTime = deskReservations[reservationindex].startDate;
                const endTime = deskReservations[reservationindex].endDate;
                const currenttime = Date.now();

                // determine if we're in the middle of this reservation
                if ((startTime < currenttime) && (endTime > currenttime)) {
                    console.log(`This reservation is currently ongoing`)
                } else {
                    console.log(`This reservation is currently not ongoing`)
                }
            }
        }
      }

}

getAvailability();


