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

    // for every desk returned
    for (let index in data) {

        //if the desk's reservation list is greater than 0, AKA has any reservations
        if (Object.keys(data[index].anonymousReservations).length > 0) {

            console.log(`Reservation(s) for desk ${data[index].name}:`)
            
            // list out each reservation for the desk
            for (let reservationindex in data[index].anonymousReservations) {
                
                console.log(data[index].anonymousReservations[reservationindex]);
            }
        }
      }

}

getAvailability();


