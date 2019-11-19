(($) => {
  $(() => {
    // View model
    window.vm = {}
    vm.items = ko.observableArray()
    vm.doneItems = ko.observableArray()
    vm.updateDelay = ko.observable(1000)

    // Item class
    vm.Item = function(id, name, done, createdAt) {
      let item = this
      let idsArr = vm.items().map(el => el.id()).sort()
      let lastId = parseInt(idsArr[idsArr.length - 1])
      let extendParams = { rateLimit: vm.updateDelay() }

      // Item id
      item.id = ko.observable(id ? parseInt(id) : (idsArr.length ? lastId+1 : 1))

      // Item name
      item.name = ko.observable(id ? name : "").extend(extendParams)
      item.name.subscribe(() => item.$ajaxPost())

      // Item done check
      item.done = ko.computed(() => {
        return !!vm.doneItems().find(id => id == item.id())
      })
      item.done.subscribe(() => item.$ajaxPost())

      // Item created at
      item.createdAt = ko.observable(createdAt)

      // Item methods
      item.isAjax = ko.observable(false)
      item.isInputFocus = ko.observable(false)
      item.isRemoveFocus = ko.observable(false)

      // Remove item from array
      item.$remove = (o, e) => {
        if (e && e.target) e.preventDefault()
        let id = item.id()

        // Remove from array
        vm.items.remove(vm.items().find(el => el.id() == id))

        // Remove from done items
        vm.doneItems.remove(id)
      }

      item.index = ko.computed(() => vm.items().findIndex(el => el == item))

      // Focus next item
      item.$focusNext = () => {
        let index = item.index()
        $(".listWrapper .item").eq(index+1).find(".nameWrapper input").focus()
      }

      // Ajax to update item in cassandra
      item.$ajaxPost = () => {
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

      // Ajax to delete item in cassandra
      item.$ajaxDelete = (o, e) => {
        if( e && e.target ) e.preventDefault()
        $.ajax({
          type: "DELETE",
          url: `/item/${item.id()}`,
          success: r => item.$remove(),
          dataType: "JSON"
        })
      }

      // Item events
      item.event = {}
      item.event.inputKeyup = (o, e) => {
        var lastItem = vm.items()[vm.items().length - 1]
        var hasName = String(o.name()).length
        if (!hasName && o != lastItem && !item.isInputFocus()) item.$ajaxDelete()
        if (String(lastItem.name()).length) vm.newItem()

        // Enter key
        if(e && e.which && e.which == 13) {
          item.$focusNext()
        }
      }
      item.event.inputBlur = (o, e) => {
        var lastItem = vm.items()[vm.items().length - 1]
        var hasName = String(o.name()).length
        if (!hasName && lastItem != o) item.$ajaxDelete()

        setTimeout(() => item.isRemoveFocus() ? item.$focusNext() : !1, 0)
      }
    }

    // Create and push new empty item in array
    vm.newItem = () => {
      var lastItem = vm.items()[vm.items().length - 1]
      if (lastItem && !lastItem.name().length) return
      vm.items.push(new vm.Item(false, "", false, new Date().getTime()))
    }

    // Fetch items from cassandra
    $.ajax("/items")
      .done(r => {
        // Sort using createdAt value as reference
        r.sort(function(a, b) {
          if (parseInt(a.createdAt) > parseInt(b.created)) return 1
          if (parseInt(a.createdAt) < parseInt(b.createdAt)) return -1
          return 0
        })

        // Parse done items
        vm.doneItems(r.filter(item => item.done == "true").map(item => parseInt(item.id)))

        // Map items
        vm.items(r.map(el => new vm.Item(...Object.values(el))))

        // Create new item placeholder
        vm.newItem()
      })

    ko.applyBindings(vm)
  })
})(jQuery)
