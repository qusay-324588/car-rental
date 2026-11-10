// jQuery implementation for toggle details and booking form visibility
$(document).ready(function() {
    $(".toggle-details").click(function() {
        $(this).closest("tr").find(".car-details").slideToggle(300);
    });

    $("#btn-continue").click(function() {
        var selectedCarsCount = $("input.car-select:checked").length;
        if (selectedCarsCount === 0) {
            alert("الرجاء اختيار سيارة واحدة على الأقل للمتابعة!");
            return;
        }
        $("#booking-form-section").slideDown(400);
    });
});

// Form validation and calculation function
function validateForm() {
    // 1. Full Name validation: Arabic letters only
    var fullName = document.getElementById("fullname").value.trim();
    var arabicRegex = /^[\u0600-\u06FF\s]+$/;
    if (fullName === "") {
        alert("الاسم الكامل إلزامي!");
        return false;
    }
    if (!arabicRegex.test(fullName)) {
        alert("الاسم الكامل يجب أن يتكون من أحرف هجائية عربية فقط!");
        return false;
    }

    // 2. National ID validation: Exactly 11 digits, first two digits range from 01 to 14
    var natId = document.getElementById("national_id").value.trim();
    var natIdRegex = /^(0[1-9]|1[0-4])\d{9}$/;
    if (natId === "") {
        alert("الرقم الوطني إلزامي!");
        return false;
    }
    if (!natIdRegex.test(natId)) {
        alert("الرقم الوطني غير صالح! يجب أن يكون 11 خانة وأول خانتين بين 01 و 14.");
        return false;
    }

    // 3. Rental start and end dates validation (yyyy-mm-dd) and logical sequence
    var startDateStr = document.getElementById("start_date").value;
    var endDateStr = document.getElementById("end_date").value;
    
    if (startDateStr === "" || endDateStr === "") {
        alert("تاريخا البداية والنهاية إلزاميان!");
        return false;
    }

    var startDate = new Date(startDateStr);
    var endDate = new Date(endDateStr);

    if (endDate <= startDate) {
        alert("تاريخ نهاية التأجير يجب أن يكون لاحقاً لتاريخ البداية!");
        return false;
    }

    // 4. Mobile number validation matching Syriatel and MTN networks in Syria
    var mobile = document.getElementById("mobile").value.trim();
    var mobileRegex = /^(09[345689])\d{7}$/;
    if (mobile !== "" && !mobileRegex.test(mobile)) {
        alert("رقم الموبايل غير صحيح! يجب أن يطابق شبكات Syriatel أو MTN (مثل 093 أو 094...).");
        return false;
    }

    // 5. Email validation (Optional, but checked if entered)
    var email = document.getElementById("email").value.trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "" && !emailRegex.test(email)) {
        alert("البريد الإلكتروني المدخل غير صالح!");
        return false;
    }

    // Calculate rental days, total amount, and apply 5% discount if duration exceeds 10 days
    var diffTime = Math.abs(endDate - startDate);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    var totalAmount = 0;
    var summaryText = "تفاصيل الحجز والسيارات المختارة:\n\n";
    summaryText += "اسم الزبون: " + fullName + "\n";
    summaryText += "مدة التأجير: " + diffDays + " يوم\n\n";

    $("input.car-select:checked").each(function() {
        var row = $(this).closest("tr");
        var carModel = row.find(".car-model").text();
        var dailyPrice = parseInt(row.find(".car-price").attr("data-price"));
        var carTotal = dailyPrice * diffDays;
        totalAmount += carTotal;
        summaryText += "- " + carModel + " | السعر اليومي: " + dailyPrice + " ل.س | إجمالي السيارة: " + carTotal + " ل.س\n";
    });

    summaryText += "\nالمبلغ الإجمالي قبل الخصم: " + totalAmount + " ل.س\n";

    if (diffDays > 10) {
        var discount = totalAmount * 0.05;
        totalAmount -= discount;
        summaryText += "تم تطبيق خصم 5% لتجاوز المدة 10 أيام (قيمة الخصم: " + discount + " ل.س)\n";
    }

    summaryText += "المبلغ النهائي الواجب دفعه: " + totalAmount + " ل.س\n";

    alert(summaryText);
    return false;
}