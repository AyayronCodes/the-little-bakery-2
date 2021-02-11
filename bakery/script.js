(() => {
  // DECS****************************************
  const sectionEls = document.querySelectorAll('.section')
  const opacityInEls = document.querySelectorAll('.opacity-in')
  const translateInEls = document.querySelectorAll('.translate-in')
  const rotateInEls = document.querySelectorAll('.rotate-in')
  let currentSection = 0
  const sectionColors = [
    null,
    {
      // section 1 (about)
      backgroundColor_start: '#081A1E',
      color_start: 'blanchedalmond',
      backgroundColor_end: 'blanchedalmond',
      color_end: '#081A1E'
    },
    {
      // section 2 (menu)
      backgroundColor_start: 'blanchedalmond',
      color_start: '#081A1E',
      backgroundColor_end: '#081A1E',
      color_end: 'blanchedalmond'
    },
    {
      // section 3 (contact)
      backgroundColor_start: 'black',
      color_start: 'white',
      backgroundColor_end: 'yellow',
      color_end: 'gray'
    }
  ]
  let sectionChange = false
  let opacityInIo
  let translateInIo
  let rotateInIo

  // FUNCTIONS***********************************
  function setupIntroPage() {
    // remove before-load class from body
    document.body.classList.remove('before-load')
    // 1s delay for opacity transition to happen
    setTimeout(() => document.querySelector('.loading-page').style.display = 'none', 1000)
    // give each span in main title appropriate delays for title animation
    const letterEls = document.querySelectorAll('.main-title span')
    letterEls.forEach((letter, index) => {
      letter.style.animation = `opacity-in 1s ${index * 0.2}s ease-in forwards`
    })
  }
  function setupIos() {
    // IO callbacks
    function opacityInCallback(entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.style.opacity = 1
        opacityInIo.unobserve(entry.target)
      })
    }
    function translateInCallback(entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.style.transform = 'translate3d(0, 0, 0)'
        translateInIo.unobserve(entry.target)
      })
    }
    function rotateInCallback(entries, observer) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.style.transform = 'rotate(0)'
        translateInIo.unobserve(entry.target)
      })
    }
    // IO options
    opacityInOptions = {
      threshold: 1
    }
    translateInOptions = {
      threshold: 1
    }
    rotateInOptions = {
      threshold: 1
    }
    // create IOs
    opacityInIo = new IntersectionObserver(opacityInCallback, opacityInOptions)
    translateInIo = new IntersectionObserver(translateInCallback, translateInOptions)
    rotateInIo = new IntersectionObserver(rotateInCallback, rotateInOptions)
    // start observing
    opacityInEls.forEach(el => opacityInIo.observe(el))
    translateInEls.forEach(el => translateInIo.observe(el))
    rotateInEls.forEach(el => rotateInIo.observe(el))
  }

  function updateSection() {
    sectionChange = false
    if (sectionEls[currentSection + 1] && sectionEls[currentSection + 1].getBoundingClientRect().top <= 0) {
      currentSection++
      if (currentSection > sectionEls.length - 1) currentSection = sectionEls.length - 1
      sectionChange = true
      return
    }
    if (sectionEls[currentSection] && sectionEls[currentSection].getBoundingClientRect().top > 0) {
      currentSection--
      if (currentSection < 0) currentSection = 0
      sectionChange = true
      return
    }
  }

  function updateColors(status) {
    // it first time, set all sections' colors
    if (status === 'start') {
      sectionEls.forEach((section, i) => {
        // return if no color change needed like intro section
        if (!sectionColors[i]) return
        section.style.backgroundColor = `${sectionColors[i].backgroundColor_start}`
        section.style.color = `${sectionColors[i].color_start}`
      })
    } else {
      if (!sectionColors[currentSection]) return
      sectionEls[currentSection].style.color = `${sectionColors[currentSection].color_end}`
      sectionEls[currentSection].style.backgroundColor = `${sectionColors[currentSection].backgroundColor_end}`
    }
  }

  function init() {
    // setup for animation to kick in
    setupIntroPage()
    // set initial colors (pass in start to apply start colors)
    updateColors('start')
    // setup Intersection Observers
    setupIos()
    // scroll e.l. to keep track of current section
    window.addEventListener('scroll', () => {
      // update current section index
      updateSection()
      // change colors if section changed
      if (sectionChange) updateColors()
    })
  }

  // EVENT LISTENERS******************************
  window.addEventListener('load', () => {
    // scroll to top (for IOs to work properly)
    setTimeout(() => {
      scrollTo(0, 0)
      init()
    }, 50)
  })
})()