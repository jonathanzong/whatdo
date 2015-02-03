// scripts.js

$(window).on('focus', function(e) { 
	loadState(); 
});

$(document).ready(function() {
	loadState();

	// toggle edit
	$("a i.fa").click(function(){
		setEditable($(".do ul").attr("contenteditable") != 'true');
	});

	$('.do ul').click(function(e) {
		var container = $(".do ul li");
	    if (!container.is(e.target) // if the target of the click isn't the container...
	        && container.has(e.target).length === 0) // ... nor a descendant of the container
	    {
	        if ($(".do ul").attr("contenteditable") != 'true') {
				setEditable(true);
			}
	    }
	});

	//keyup prevented the user from deleting the bullet (by adding one back right after delete), but didn't add in <li>'s on empty <ul>s, thus keydown added to check
	$('.do ul').on('keyup keydown', function(e) {
	    var $this = $(this);
	    if (! $this.html()) {
	        var $li = $('<li></li>');
	       
	        var sel = window.getSelection();
	        
	       var range = sel.getRangeAt(0);
	       
	        range.collapse(false);
	        range.insertNode($li.get(0));
	        range = range.cloneRange();
	        range.selectNodeContents($li.get(0));
	        range.collapse(false);
	        sel.removeAllRanges();
	        sel.addRange(range);
	        
	    }

	    if (e.keyCode == 27 && $(".do ul").attr("contenteditable") == 'true') {
	    	// esc pressed
			setEditable(false);
	    }
	});
});

// http://stackoverflow.com/questions/1403615/use-jquery-to-hide-a-div-when-the-user-clicks-outside-of-it
$(document).mouseup(function (e)
{
    var container = $(".do ul");
    if (!container.is(e.target) // if the target of the click isn't the container...
    	&& !$(".fa").is(e.target)
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        setEditable(false);
    }
});

function setEditable(editable) {
	if (editable) {
		$(".do ul").attr("contenteditable", true).focus();
		$("a i.fa").removeClass("fa-edit").addClass("fa-close");
	}
	else {
		$(".do ul").attr("contenteditable", false);
		$("a i.fa").removeClass("fa-close").addClass("fa-edit");
		saveState();
	}
}

function attachToggleDoneListener() {
	// mark as done
	$(".do li").off('click').click(function() {
		if ( $(".do ul").attr("contenteditable") != 'true' ) {
			if ($(this).parents(".do").length > 0) {
				$(this).animate({
					left: $(window).width()
				}, 750, function() {
					$(this).prependTo(".did ul").animate({
						left: '0'
					}, 500, function() {
						saveState();
					});
				});
			}
		}
	});
	$(".did li").off('click').click(function() {
		if ($(this).parents(".did").length > 0) {
			$(this).appendTo(".do ul");
			saveState();
		}
	});
}

function saveState() {
	var json = {};
	json.do = [];
	$(".do ul li").each(function() {
		if ($(this).text().length > 0) {
			json.do.push($(this).text());
		}
	});

	json.did = [];
	$(".did ul li").each(function(i, e) {
		if (i < 10) {
			if ($(this).text().length > 0) {
				json.did.push($(this).text());
			}
		}
	});

	localStorage.setItem("whatdo_state", JSON.stringify(json));

	attachToggleDoneListener();
}

function loadState() {
	var state = JSON.parse(localStorage.getItem("whatdo_state"));

	if (!state)
		return;

	$(".do ul").empty();
	for (var i = 0; i < state.do.length; i++) {
		$(".do ul").append("<li>" + state.do[i] + "</li>");
	}

	$(".did ul").empty();
	for (var i = 0; i < state.did.length; i++) {
		$(".did ul").append("<li>" + state.did[i] + "</li>");
	}

	attachToggleDoneListener();
}