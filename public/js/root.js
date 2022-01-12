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
            swal("Đã thêm vào giỏ hàng!", "cảm ơn", "success");
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
            swal("Đã xóa sản phẩm!", "Tiếp tục mua!", "success");
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

            $("#total1").load(root + "/cart #total2");
            $("#qty" + id).load(root + "/cart " + qty2);
            $("#temp1").load(root + "/cart #temp2");
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

            $("#total1").load(root + "/cart #total2");
            $("#temp1").load(root + "/cart #temp2");
            $("#qty" + id).load(root + "/cart " + qty2);
            $("#numCart1").load(root + "/cart #numCart2");
            if ($(qty2).text() === '1') {
                $(tr_cart_id).empty();
            }
        }
    })
})


var mybutton = document.getElementById("myBtn");
window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

$('button.order').click(function(event) {
    var emailCustom = $('input#emailCustom').val();

    //alert(emailCustom);
    //   Email.send({
    //      SecureToken: "8fdcd2ba-b08c-4c56-b11b-428835e438f1",
    //       To : emailCustom,
    //       From : "theharleyhouse.org@gmail.com",
    //       Subject : "Xác nhận đơn hàng",
    //       Body : "Chúc mừng bạn đã đặt thành công! Cảm ơn đã ghé thăm chúng tôi."
    //   }).then(
    //   message => alert("Chúng tôi đã xác nhận đơn của bạn. Vui lòng kiểm tra mail!")
    //   );
    Email.send({
        Host: "smtp.gmail.com",
        Username: "theharleyhouse.org@gmail.com",
        Password: "PhamThanhDuc090420",
        To: emailCustom,
        From: "theharleyhouse.org@gmail.com",
        Subject: "Xác nhận đơn hàng",
        Body: "Chúc mừng bạn đã đặt thành công! Cảm ơn đã ghé thăm chúng tôi.  "
    }).then(
        message => alert("Chúng tôi đã xác nhận đơn của bạn. Vui lòng kiểm tra mail!")
    );
});