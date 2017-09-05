$(document).ready(function() {
    $('button.jsonpatcher').click(function(e) {
        e.preventDefault()
        var original_object = {}
        var patch = []
        var flag = 0
        if ($('#original_object').val().length) {
            try {
                original_object = JSON.parse($('#original_object').val())
            } catch (e) {
                flag = 1
                $('#original_object').val('This is not a valid JSON string')
            }
        } else {
            original_object = {
                'baz': 'qux',
                'foo': 'bar'
            }
        }
        if ($('#patch').val().length) {
            try {
                patch = JSON.parse($('#patch').val())
            } catch (e) {
                flag = 1
                $('#patch').val('This is not a valid JSON string')
            }
        } else {
            patch = [
                { 'op': 'replace', 'path': '/baz', 'value': 'boo' },
                { 'op': 'add', 'path': '/hello', 'value': 'world' },
                { 'op': 'remove', 'path': '/foo' }
            ]
        }
        if (flag == 0) {
            $.ajax({
                type: 'POST',
                url: '/welcome',
                data: { original: original_object, patch: patch },
                error: function(data) {
                    console.log(data)
                },
                success: function(result) {
                    $('#result').val(JSON.stringify(result))
                }
            })
        }
    })
})