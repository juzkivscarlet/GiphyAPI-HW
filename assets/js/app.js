$(document).ready(function() {

    var btnCount = 0;
    var deckCount = 0;
    var cardCount = 0;
    var searchCount = 0;
    var list = JSON.parse(localStorage.getItem("btnList"));
    if(!Array.isArray(list)) list = ["Crying","Eye Roll","Facepalm","Happy","No...","lol"];

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
        var term = $(this).text();
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + term + "&limit=9&api_key=" + key;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(data) {
            
            var results = data.data;
            console.log(results);

            var header = $("<h2>").text(" '"+term+"' Gifs");

            var newSearch = $("<div>").attr('id','search-'+searchCount);
            
            var decks = [];
            var cards = [];

            for(var i=0; i<(Math.ceil(results.length/3)); i++) {
                var newDeck = $("<div>").addClass("card-deck").attr('id','deck-'+deckCount);
                // console.log('deck-'+deckCount);
                newSearch.prepend(newDeck);
                decks.push(newDeck);
                deckCount++;
            }
            console.log(decks);

            for(var i=0; i<results.length; i++) {
                var rightDeck = decks[Math.floor(i/3)];
                var newCard = $("<div>").addClass("card");
                var gif = $("<img>").attr('src',results[i].images.original.url).addClass("card-img-top");
                newCard.append(gif);
                rightDeck.prepend(newCard);
                cards.push(newCard);
                cardCount++;
            }

            for(var i=0; i<decks.length; i++) {
                newSearch.prepend(decks[i]);
            }
            
            newSearch.prepend(header);
            $("#display").prepend(newSearch);
        });
    });

    $("#clearDisplay").click(function() {
        $("#display").empty();
        deckCount=0;
    });

    btnCount = list.length;
    renderBtns(list);
    localStorage.setItem("btnList",JSON.stringify(list));
});