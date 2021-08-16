document.getElementById('year').innerHTML = new Date().getFullYear()
const root = location.protocol + "//" + location.host
console.log(root)

$('.addToCart').click(function(event) {
    event.preventDefault()
    const href = this.href
    console.log(href)
    $.ajax({
        url: href,
        type: 'GET',
        data: {},
        success: function() {
            swal("Add successful!", "continute!", "success");
            $("#numCart1").load(root + " #numCart2");
        }
    })

})

$('.deleteCart').on("submit", function(event) {
    event.preventDefault()
    const action = $(this).attr('action')

    const href = root + action
    const tr_cart_id = "#tr_cart_" + $(this).data("id")

    $.ajax({
        url: href,
        type: 'DELETE',
        data: {},
        success: function() {
            swal("Delete successful!", "continute!", "success");
            $("#total1").load(root + "/cart #total2");
            $(tr_cart_id).empty();
            $("#numCart1").load(root + "/cart #numCart2");
        }
    })
})

$('.reduceCart').on("submit", function(event) {
    event.preventDefault()
    const action = $(this).attr('action')
    const id = $(this).data("id")
    const qty2 = "#qty2" + id
    const tr_cart_id = "#tr_cart_" + id
    $.ajax({
        url: action,
        type: 'PUT',
        data: {},
        success: function() {
            swal("Edit successful!", "continute!", "success");
            $("#total1").load(root + "/cart #total2");
            $("#qty" + id).load(root + "/cart " + qty2);
            $("#numCart1").load(root + "/cart #numCart2");
            if ($(qty2).text() === '1') {
                $(tr_cart_id).empty();
            }
        }
    })
})

$('.increaseCart').on("submit", function(event) {
    event.preventDefault()
    const action = $(this).attr('action')
    const id = $(this).data("id")
    const qty2 = "#qty2" + id
    const tr_cart_id = "#tr_cart_" + id
    $.ajax({
        url: action,
        type: 'PUT',
        data: {},
        success: function() {
            swal("Edit successful!", "continute!", "success");
            $("#total1").load(root + "/cart #total2");
            $("#qty" + id).load(root + "/cart " + qty2);
            $("#numCart1").load(root + "/cart #numCart2");
            if ($(qty2).text() === '1') {
                $(tr_cart_id).empty();
            }
        }
    })
})