export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXNobmlsdmF6aXJhbmkyNiIsImEiOiJja2I0bWl0ejcwaGJtMnpvMjZ2bTk3MnhmIn0.BaJvzOECk-BShNeZaAyLpA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/ashnilvazirani26/ckb4mqjcb20k61jmxj8nchfqk',
        scrollZomm: false,
        // center: [77.6088, 43.1566],
        zoom: 8,
        // interactive: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        const el = document.createElement('div');
        el.className = 'marker';
        new mapboxgl.Marker({
            elment: el,
            anchor: 'bottom'
        }).setLngLat(loc.coordinates).addTo(map);

        new mapboxgl.Popup({
                offset: 50
            }).setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        bounds.extend(loc.coordinates);
    })

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
}