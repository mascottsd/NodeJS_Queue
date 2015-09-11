// Joblist data array for filling in info box
var jobListData = [];

// DOM Ready =============================================================
$(document).ready(function()
{
    // Populate the job table on initial page load
    populateTable();

    // Jobname link click
    $('#jobList table tbody').on('click', 'td a.linkshowjob', showJobInfo);
    // Delete Job link click
    $('#jobList table tbody').on('click', 'td a.linkdeletejob', deleteJob);

    // Add Job button click
    $('#btnAddJob').on('click', addJob);
});

// Functions =============================================================

// Fill table with data
function populateTable()
{
    var tableContent = ''; // Empty content string

    // jQuery AJAX call for JSON
    $.getJSON( '/jobs/joblist', function( data ) {

        // Stick our job data array into a joblist variable in the global object
        jobListData = data;
        
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this._id + '</td>';
            tableContent += '<td><a href="#" class="linkshowjob" rel="' + this._id + '">' + this.url + '</a></td>';
            tableContent += '<td><a href="#" class="linkdeletejob" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#jobList table tbody').html(tableContent);
    });
};

// Show Job Info
function showJobInfo(event)
{
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve job from link rel attribute
    var thisJobId = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = jobListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisJobId);

    // Get our Job Object
    var thisJobObject = jobListData[arrayPosition];

    //Populate Info Box
    $('#jobInfoHtml').text((thisJobObject && thisJobObject.html) ? thisJobObject.html : 'not downloaded yet');

};

// Add Job
function addJob(event)
{
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addJob input').each(function(index, val) {
        if ($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if ( !errorCount ) {
        // If it is, compile all job info into one object
        var newJob = {
            'url': $('#addJob fieldset input#inputJobUrl').val(),
            'html': ''
        }

        // Use AJAX to post the object to our addjob service
        $.ajax({
            type: 'POST',
            data: newJob,
            url: '/jobs/',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#addJob fieldset input').val('');

                // Update the table
                populateTable();
            
            } else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    } else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete Job
function deleteJob(event)
{
    event.preventDefault();

    // Pop up a confirmation dialog - make sure the job confirmed
    var confirmedOk = confirm('Are you sure you want to delete this job?');
    if ( confirmedOk ) {
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/jobs/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg !== '')
                alert('Error: ' + response.msg);

            // Update the table
            populateTable();

        });
    }

};