export default function GetMarkerCategory(markerCategories = [], id) {
    return markerCategories.find((category) => category?.id === id)?.name;
}
