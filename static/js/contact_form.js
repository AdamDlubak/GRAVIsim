  $(document).ready(function () {
        $('#contact-form').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                subject: {
                    validators: {
                        stringLength: {
                            min: 5,
                            message: 'Subject should have more than 5 characters'
                        },
                        notEmpty: {
                            message: 'Please supply subject'
                        }
                    }
                },
                message: {
                    validators: {
                        stringLength: {
                            min: 10,
                            message: 'Message should have more than 10 characters'
                        },
                        notEmpty: {
                            message: 'Please write message'
                        }
                    }
                }
            }
        })
            .on('success.form.bv', function (e) {
                $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
                $('#contact-form').data('bootstrapValidator').resetForm();

                // Prevent form submission
                e.preventDefault();

                // Get the form instance
                var $form = $(e.target);

                // Get the BootstrapValidator instance
                var bv = $form.data('bootstrapValidator');

                // Use Ajax to submit form data
                $.post($form.attr('action'), $form.serialize(), function (result) {
                    console.log(result);
                }, 'json');
            });
    });
