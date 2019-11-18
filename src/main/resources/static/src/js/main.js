(($) => {
  $(() => {
    // View model
    window.vm = {}
    vm.items = ko.observableArray()
    vm.checkItem = id => {
      console.log("id:", id)
    }

    // Item class
    let Item = function(id, name, qty, createdAt, done) {
      let item = this
      item.id = ko.observable(id)
      item.name = ko.observable(name)
      item.qty = ko.observable(qty)
      item.createdAt = ko.observable(createdAt)
      item.done = ko.observable(done)
    }

    let itemsArr = [{
        id: "1",
        name: "Sorvete vegano",
        qty: 3,
        createdAt: new Date(),
        done: false
      },
      {
        id: "2",
        name: "Paçoquita",
        qty: 7,
        createdAt: new Date(),
        done: false
      },
      {
        id: "3",
        name: "Ades",
        qty: 1,
        createdAt: new Date(),
        done: new Date()
      },
      {
        id: "4",
        name: "Arroz integral",
        qty: 1,
        createdAt: new Date(),
        done: false
      },
    ]

    vm.items(
      itemsArr.map(el => new Item(...Object.values(el)))
    )

    ko.applyBindings(vm)
  })
})(jQuery)
