document.addEventListener('DOMContentLoaded', () => {
    console.log(' DOM fully loaded and parsed');
    const grid = document.querySelector('.grid') // js method that allows us to pick out elemnts from our html
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let doodlerBottomSpace = 150


    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'

    }

    createDoodler()

})