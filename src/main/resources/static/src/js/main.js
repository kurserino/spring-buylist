(($) => {
  $(() => {
    // View model
    window.vm = {}
    vm.items = ko.observableArray()
    vm.doneItems = ko.observableArray()
    vm.doneItems.subscribe(doneItems => {
      vm.items().map(item => item.done(false))
      doneItems.map(item => item.done(true))
    })
    vm.updateDelay = ko.observable(1000)

    // Item class
    vm.Item = function(id, name, done, createdAt) {
      let item = this
      let idsArr = vm.items().map(el => el.id()).sort()
      let lastId = idsArr[idsArr.length - 1]
      item.id = ko.observable(
        id ? parseInt(id) : (idsArr.length ? parseInt(lastId) + 1 : 1)
      )
      item.isNew = ko.observable(id ? false : true)
      item.isAjax = ko.observable(false)
      item.$update = () => {
        $.ajax({
          type: "POST",
          url: "/item",
          data: {
            "id": item.id(),
            "name": item.name(),
            "createdAt": item.createdAt(),
            "done": item.done()
          },
          dataType: "JSON"
        })
      }
      item.$delete = (o, e) => {
        if( e && e.target ) e.preventDefault()
        $.ajax({
          type: "DELETE",
          url: `/item/${item.id()}`,
          success: r => item.remove(),
          dataType: "JSON"
        })
      }
      item.name = ko.observable(id ? name : "").extend({
        rateLimit: vm.updateDelay()
      })
      item.name.subscribe(() => item.$update())
      item.done = ko.observable(done == "true" ? true : false)
      item.done.subscribe(() => item.$update())

      item.createdAt = ko.observable(createdAt)
      item.focus = ko.observable(false)

      item.event = {}
      item.event.keyup = (o, e) => {
        var lastItem = vm.items()[vm.items().length - 1]
        var hasName = String(o.name()).length
        if (!hasName && o != lastItem && !item.focus()) item.$delete()
        if (String(lastItem.name()).length) vm.newItem()
      }
      item.event.blur = (o, e) => {
        var lastItem = vm.items()[vm.items().length - 1]
        var hasName = String(o.name()).length
        if (!hasName && lastItem != o) item.$delete()
      }

      item.remove = (o, e) => {
        if (e && e.target) e.preventDefault()
        vm.items.remove(vm.items().find(el => el.id() == item.id()))
      }
    }

    vm.newItem = () => {
      var lastItem = vm.items()[vm.items().length - 1]
      if (lastItem && !lastItem.name().length) return
      vm.items.push(new vm.Item(false, "", false, new Date().getTime()))
    }

    $.ajax("/items")
      .done(r => {
        r.sort(function(a, b) {
          if (parseInt(a.createdAt) > parseInt(b.created)) return 1
          if (parseInt(a.createdAt) < parseInt(b.createdAt)) return -1
          return 0
        })
        vm.items(r.map(el => new vm.Item(...Object.values(el))))
        vm.doneItems(vm.items().filter(item => item.done()))
        vm.newItem()
      })

    ko.applyBindings(vm)
  })
})(jQuery)
