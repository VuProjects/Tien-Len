/**
* Hand Object
*
* Will control all actions associated with
* a players hand such as: sort, get_card,
* add_card, etc ...
*
* Example:
* > var cards = [Card('queen-hearts'), Card('jack-clubs')];
* > var hand = Hand(cards);
*/
var Hand = Class.$extend({
  __init__ : function(cards) {
    this.cards = cards;

    // Total Hand Value
    this.value = 0;

    this.initialize();
  },

  /* Initialize hand parameters */
  initialize: function() {
    this.sort();  
  },

  /** 
   * Sorts the cards in the deck using an
   * insertion sort by card value
   *
   * example:
   *  > hand.sort();
   */
  sort : function() {
    for (i = 0; i < this.cards.length; i++) {
      var k = this.cards[i];
      var j = i - 1;

      while (j >= 0 && this.cards[j].value > k.value) {
        this.cards[j + 1] = this.cards[j];
        j--;
      }

      this.cards[j + 1] = k;
    }
  },

  /** 
   * Set the total value of a hand
   *
   * example:
   *  > this.set_value();
   */
  set_value: function() {
    for (i = 0; i < this.cards.length; i++) {
      this.value += this.cards[i].value;
    } 
  },

  /** 
   * Add a card to the hand
   * card - a csrd object
   *
   * example:
   *  > this.add_card(Card('queen-hearts'));
   */
  add_card: function(card) {
    this.cards.push(card)  
  },

  /** 
   * Get a card from the hand
   * card - a string of the cards codename
   *
   * example:
   *  > this.get_card('queen-hearts');
   */
  get_card : function(card) {
    for (i = 0; i < this.cards.length; i++) {
      if (this.cards[i].card == card)
        return this.cards[i];
    } 
    return [];
  },

  /** 
   * Remove a card from the hand
   * card - a string of the cards codename
   *
   * example:
   *  > this.remove_card('queen-hearts');
   */
  remove_card : function(card) {
    for (i = 0; i < this.cards.length; i++) {
      if (this.cards[i].card == card) {
        this.cards.splice(i, 1);
        break;
      }
    }   
  },

  /* Get the lowest card in the hand */
  lowest_card : function() {
    return this.cards[0];
  },

  /** 
   * Convert the cards in the hand to a 
   * more readable list format
   *
   * example:
   *  > hand.to_sting();
   *  > ['queen-hears', 'ace-spades', 'jack-clubs']
   */
  to_string: function() {
    var card_strings = [];

    for (i = 0; i < this.cards.length; i++) {
      card_strings.push(this.cards[i].human_name);
    }

    return card_strings;
  }
});


/**
* Chosen Hand Object (Hand Child)
*
* Will control all actions associated with
* a players choden hand such as: sort, get_card,
* add_card, etc ..
*
* Example:
* > var cards = [Card('queen-hearts'), Card('jack-clubs')];
* > var hand = ChosenHand(cards);
*/
var ChosenHand = Hand.$extend({
  __init__ : function() {
    this.cards = [];

    // Test for valid hand
    this.is_valid = false;

    // Test for special hands
    this.is_buster = false;
    this.is_lock = false;

    // Hand type and types for human
    // readable purposes
    this.human_hand_type = '';
    this.human_hand_types = {
      's': 'Single',
      'tk': 'Two of a Kind',
      'trk': 'Three of a Kind',
      'fk': 'Four of a kind (buster)',
      'str': 'Straight',
      'sl': 'Straight Lock',
      'sp': 'Straight of Pairs (buster)'
    };

    // Hand type and types for logic
    this.hand_type = '';
  },

  /** 
   * Resets a hand to default values
   *
   * Example:
   *  > this.reset();
   */
  reset : function() {
    this.value = 0;
    this.human_hand_type = '';
    this.hand_type = '';
    this.is_valid = false;
    this.is_buster = false;
    this.is_lock = false;
  },


  /** 
   * Checks if one or more cards have
   * the same face values. For pairs
   * and three of a kind, and four
   * or a kind
   *
   * Returns boolean
   *
   * Example:
   *  > this.have();
   */ 
  have_same_face_values : function() {
    var same = false;
    var prev_face_value = 0;

    for (i =0; i < this.cards.length; i++) {
      if (prev_face_value > 0) {
        if (prev_face_value == this.cards[i].face_value) {
          same = true;
        } else {
          same = false;
        }
      }
      prev_face_value = this.cards[i].face_value;
    }

    return same;
  },

  /**
  * Checks to see if the cards make a
  * valid hand: two of a kind, three, etc.
  * Lots of logic here
  *
  * Possible hands:
  *   Single card
  *   Two of a kind
  *   Three of a kind
  *   Four of a kind (buster)
  *   Straight
  *   Straight of same suit (Lock)
  *   Straight of pairs (buster)
  *
  * example:
  *  > this.set_hand();
  */
  set_hand : function() {
    var hand_type = '';

    // reset hand flags
    this.reset();

    // check for single card
    if (this.cards.length == 1) {
      hand_type = 's';
      this.is_valid = true;
      this.hand_type = hand_type;
    }

    // check for a pair
    if (this.cards.length == 2) {
      if (this.have_same_face_values()) {
        hand_type = 'tk';
        this.is_valid = true;
      }
    }
        
    
    // check for four kind or straight
    if (this.cards.length == 3) {
      // check for three of a kind
      if (this.have_same_face_values()) {
        hand_type = 'trk';
        this.is_valid = true;
      }
    }

    // check for four of a kind or straight
    if (this.cards.length == 4) {
      // check for 4 of a kind
      if (this.have_same_face_values()) {
        hand_type = 'fk';
        this.is_valid = true;
        this.is_buster = true;
      }
    }   
          

    // set the value and type of the hand
    this.set_value();
    this.hand_type = hand_type;
    this.human_hand_type = this.human_hand_types[hand_type];  
  }
});


/**
* Card Object
*
* Creates a card object that contains
* cards raw value, face value, and human
* readable name
*
* Example:
* > var card = Card('queen-hearts');
*/
var Card = Class.$extend({
  __init__ : function(card) {
    /* Card raw value */
    this.card = card;

    /* A dictionary of the number/type of card
       and its associated face value */
    this.face_values = {
      'two': 15,
      'three': 3,
      'four': 4,
      'five': 5,
      'six': 6,
      'seven': 7,
      'eight': 8,
      'nine': 9,
      'ten': 10,
      'jack': 11,
      'queen': 12,
      'king': 13,
      'ace': 14
    };

    /* Value modifier for suits */
    this.suit_modifier = {
      'hearts': 0.4,
      'diamonds': 0.3,
      'clubs': 0.2,
      'spades': 0.1
    }

    /* Card values and human name */
    this.face_value = 0;
    this.value = 0;
    this.human_name = '';

    this.initialize();
  },

  /* Initialize card parameters */
  initialize : function() {
    var split = this.card.split('-');
  
    // set the face value of the card for matching purposes
    this.face_value = this.face_values[split[0]];

    // set the numerical face value of the card
    this.value = this.face_values[split[0]] + this.suit_modifier[split[1]];

    // set the cards human name
    this.human_name = this.cap_first(split[0]) + ' of ' + this.cap_first(split[1]);
  },

  /** 
   * String functionality. Captializes
   * the first letter in a string
   *
   * example:
   *  > card.cap_first('any-string');
   *  > 'Any-string'
   */
  cap_first: function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
});


/**
* Deck Object
*
* Holds all information about the games deck.
* Generates, shuffles, and deals
*
* Example:
* > var deck = Deck(num_of_players);
* > deck.shuffle();
* > var hands = deck.deal();
*/
var Deck = Class.$extend({
  __init__ : function(players) {
    /* Total number of players */
    this.players = players;

    /* All the hands that are dealt */
    this.hands = [];

    /* Cards left to deal and total amount to deal */
    this.cards_to_deal = 13 * players;
    this.cards_left_to_deal = 13 * players;

    /* A list holding the entire deck */
    this.deck = [];

    /* Card faces */
    this.faces = [
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'jack',
      'queen',
      'king',
      'ace'
    ]

    /* Card suits */
    this.suits = [
      'hearts',
      'diamonds',
      'clubs',
      'spades'
    ]

 	  this.gen_deck();
  },

  /* Generate the deck */
  gen_deck: function() {
    for (var i = 0; i < this.suits.length; i++) {
      for (var j = 0; j < this.faces.length; j++) {
        var card = this.faces[j] + '-' + this.suits[i];
        this.deck.push(card);
      }
    }
  },

  /** 
   * Shuffles the deck using Fisher-Yates algorithm
   *
   * example:
   *  > deck.shuffle();
   */
  shuffle : function() {
  	var new_deck = [];
  
    // copy over the deck
  	for (var i = 0; i < this.deck.length; i++) {
      new_deck.push(this.deck[i]);	
  	}

    // shuffle
  	for (var i = 51; i >= 0; i--) {
      var j = Math.floor(Math.random()*i)
      var j_val = new_deck[j];
      var i_val = new_deck[i];
      new_deck[j] = i_val;
      new_deck[i] = j_val;
  	}

    this.deck = new_deck;
  },

  /** 
   * Deals the cards in a standard alternating
   * fashion for N players. Returns a list of
   * Hand objects
   *
   * example:
   *  > var hands = deck.deal();
   */
  deal : function() {
    var current_player = 0;

    if (this.cards_left_to_deal == 0)
      return this.hands;

    // create some empty hands
    for (var i = 0; i < this.players; i++) {
      this.hands.push([]);
    }

    // fill the hands
    for (var i = 0; i < this.cards_to_deal; i++) {
      if (current_player == this.players) {
        current_player = 0;
      }
      this.hands[current_player].push(Card(this.deck.pop()));
      current_player++;
      this.cards_left_to_deal--;
    }

    // wrap cards in the hand object
    for (i = 0; i < this.hands.length; i++) {
      this.hands[i] = Hand(this.hands[i]);
    }

    return this.hands;
  }
});


/**
* Player Object
*
* Stores player information and creates
* player abilities such as play hand, choose
* card, remove cards, etc.
*
* Example:
* > var hand = Hand(Card('queen-hearts'), Card('jack-clubs'));
* > var player = Player('name', hand);
*/
var Player = Class.$extend({
  __init__ : function(name, hand) {
    /* The players name */
    this.name = name || 'Rodrigo';

    /* A list of cards the player has */
    this.hand = hand;

    /* Cards the player has chosen to play */
    this.chosen_hand = ChosenHand();
  },

  /* Play cards that are chosen */
  play : function() {
 
  },

  /** 
   * Choose a card from the players hand
   * and put in in the chosen hand.
   *
   * example:
   *  > player.choose_card('queen-hearts');
   */
  choose_card : function(card) {
    var chosen_card = this.hand.get_card(card);
    if (chosen_card.length != 0) {
      this.chosen_hand.add_card(chosen_card);
      this.hand.remove_card(card);
    }
  },

  /** 
   * Loses a card from the players hand
   * that the player might not have wanted
   *
   * example:
   *  > player.lose_card('queen-hearts');
   */
  lose_card : function(card) {
    var chosen_card = this.chosen_hand.get_card(card);
    if (chosen_card.length != 0) {
      this.chosen_hand.remove_card(card);
      this.hand.add_card(chosen_card);
      this.hand.sort();
    }
  }
});


/** 
 * Game Object
 * 
 * Bootstraps the entire game. Creates
 * all of the Player, Hand, Card, and Deck
 * objects and stores them in attributes.
 * Majority of the game play will happen here.
 * 
 * Example:
 * > var game = Game(['player_name', 'player_name']);
 */
var Game = Class.$extend({
  __init__ : function(players) {
    /* The numbers of players in the game */
    this.num_players = 0;

    /* A list of the player in the game */
    this.players = [];

    /* The Entire Deck */
    this.deck = null;

    /* All Hands */
    this.hands = null;

    /* Player who won the game */
    this.winner = null;

    /* Player who is currently winning */
    this.current_winner = null;

    /* Players who's turn it is */
    this.current_player = null;

    /* Status of the game */
    this.status = 'not_started';

    this.initialize(players);
  },

  initialize : function (players) {

    // get the number of players
    this.num_players = players.length;

    // initialize the deck and shuffle
    this.deck = Deck(this.num_players);
    this.deck.shuffle();

    // deal the hands
    this.hands = this.deck.deal();

    // initialize the players with hands
    for (i = 0; i < players.length; i++) {
      this.players.push(Player(players[i], this.hands.pop()));
    }
  },

  /* Start a new game */
  start : function() {
    this.status = 'started';
  },

  /* Quit the game */
  quit : function() {
    
  }
});
