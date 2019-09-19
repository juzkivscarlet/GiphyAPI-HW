$(document).ready(function() {

    var btnCount = 0;
    var deckCount = 0;
    var cardCount = 0;
    var searchCount = 0;
    var list = JSON.parse(localStorage.getItem("btnList"));
    var faves = JSON.parse(localStorage.getItem("faveList"));
    if(!Array.isArray(list)) list = ["Crying","Eye Roll","Facepalm","Happy","No","lol"];
    if(!Array.isArray(faves)) faves = [];

    var key = "iEj0U982tl3CVKL8Vo8C40MfK2BfbLN9";

    function renderBtns(list) {
        $("#gifBtns").empty();

        for(var i=0; i<list.length; i++) {
            var btn = $("<button>").attr('type','button').attr('id','btn-'+btnCount).text(list[i]);
            btn.addClass("btn btn-outline-primary btn-md btn-search");
            $("#gifBtns").append(btn);
        }

        btnCount = list.length;
    }

    $("#resetBtns").click(function() {
        $("#gifBtns").empty();

        list = ["Crying","Eye Roll","Facepalm","Happy","No","lol"];
        localStorage.setItem("btnList",JSON.stringify(list));
        renderBtns(list);
    });

    $("#add-term").click(function(event) {
        event.preventDefault();

        var added = $("#search-term").val().trim();
        btnCount++;

        list.push(added);
        renderBtns(list);
        localStorage.setItem("btnList",JSON.stringify(list));
        $("#search-term").val("");
    });

    $(document.body).on("click",".btn-search",function() {
        var term = "'"+$(this).text()+"' Gifs";
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + term + "&limit=9&api_key=" + key;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(data) {
            
            var results = data.data;
            showResults(results,term);
        });
    });

    function showResults(results,term) {
        var header = $("<h2>").text(term);

        var newSearch = $("<div>").attr('id','search-'+searchCount);
            
        var decks = [];
        var cards = [];

        for(var i=0; i<(Math.ceil(results.length/3)); i++) {
            var newDeck = $("<div>").addClass("card-deck").attr('id','deck-'+deckCount);
            newSearch.prepend(newDeck);
            decks.push(newDeck);
            deckCount++;
        }

        for(var i=0; i<results.length; i++) {
            if(results==faves) {
                var imgSrc = results[i].src;
                var isFave = true;
            } else {
                var imgSrc = results[i].images.original.url;
                var isFave = false;
                for(var j=0; j<faves.length; j++) {
                    if(faves[j].src==imgSrc) isFave = true;
                }
            }

            var rightDeck = decks[Math.floor(i/3)];
            var newCard = $("<div>").addClass("card border border-secondary");
            var gif = $("<img>").attr('src',imgSrc).addClass("card-img-top");
            var idTerm = term.toLowerCase();
            if(idTerm.includes(" ")) {
                idTerm = idTerm.replace(" ","");
            }
            gif.attr('id','d'+(deckCount-1)+"Img"+cardCount);
            newCard.append(gif);

            var newBody = $("<div>").addClass("card-body");
            if(results[i].title!="") var h = $("<div>").addClass("card-title font-italic font-weight-bold").text(results[i].title);
            else var h = $("<div>").addClass("card-title font-italic font-weight-bold").text("...[no title...]");
            h.attr('id','d'+(deckCount-1)+"Img"+cardCount+"title");
            newBody.prepend(h);

            var p = $("<p>").addClass("card-text");
            p.html("Rating: "+results[i].rating.toUpperCase());
            p.attr('id','d'+(deckCount-1)+"Img"+cardCount+"rating");
            newBody.append(p);

            var b = $("<button>").attr('id','d'+(deckCount-1)+'Img'+cardCount+"fave");
            if(isFave) {
                b.text("Remove from faves").addClass("btn btn-sm btn-outline-danger fav-manage").attr('data-img-fave','true');
            } else b.text("Add to faves").addClass("btn btn-sm btn-primary fav-manage").attr('data-img-fave','false');
            
            newBody.append(b);

            newCard.append(newBody);
            rightDeck.prepend(newCard);
            cards.push(newCard);
            cardCount++;
        }

        for(var i=0; i<decks.length; i++) {
            newSearch.prepend(decks[i]);
        }
            
        newSearch.prepend(header);
        $("#display").prepend(newSearch);
    }

    $("#clearDisplay").click(function() {
        $("#display").empty();
        deckCount=0;
    });

    $("#showFaves").click(function(e) {
        e.preventDefault();
        var term = "Favorite Gifs!";
        showResults(faves,term);
    });

    $(document.body).on("click",".fav-manage",function() {
        var imgId = $(this).attr('id').replace("fave","");
        var img = $("#"+imgId);
        var src = img.attr('src');

        if($(this).attr('data-img-fave')=='false') {
            // image isn't favorited already, append to faves
            faves[faves.length] = {
                title: $("#"+imgId+"title").text(),
                src: src,
                rating: $("#"+imgId+"rating").text()
            };
            $(this).text("Remove from faves").removeClass("btn-primary").addClass("btn-outline-danger").attr('data-img-fav','true');
        } else {
            // image is already favorited, remove from faves
            for(var i=0; i<faves.length; i++) {
                if(faves[i].src==src) var n=i;
            }
            faves.splice(n,1);
            $(this).text("Add to faves").removeClass("btn-outline-danger").addClass("btn-primary").attr('data-img-fav','false');
        }

        
        localStorage.setItem("faveList",JSON.stringify(faves));
    });

    btnCount = list.length;
    renderBtns(list);
    localStorage.setItem("btnList",JSON.stringify(list));
});