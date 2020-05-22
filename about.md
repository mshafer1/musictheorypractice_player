---
layout: default
# debug_mode: ENABLE_DEBUG_LOGGING=1&

bracket: '{'
endbracket: '}'
parameters:
- name: n
  type: integer
  default: 1
  example: n=1&
  description: specify the number of times to allow the file to be played (visualized by that many play buttons)
- name: title
  type: text
  example: title=some+text+to+put+on+player&
  default: <em>empty</em>
  description: provide a label (or title) with the player. (Note that this must be [URL Encoded](https://www.w3schools.com/tags/ref_urlencode.ASP) to work properly)
- name: width
  type: decimal (0 - 1)
  example: width=.5&
  default: .8
  description: sets the width within the frame that the player takes up
- name: duration
  type: integer
  default: 0
  example: duration=1&title=+&
  description: will cause the player to store (in the browser) how many times the file has been played (up to {duration} days).
  note: >
    Note: This option will not have an effect if the user's browser is set to not allow cookies from our site.
    <br/><br/>
    This option allows tracking across refreshes *in the same browser*, but requires that each occurrence either have a unique URL and `title` pairing, or, (if re-using) that the expected access times fall at least `duration` days apart.
    <br/><br/>
    Example: If you would like to give a test on Thursday (open for 1 day), and re-use a file from that test in another test next Thursday, then a `duration` of 1 will work fine because the file will be completely reloaded when re-accessed next Thursday.
    <br/><br/>
    Example (bad): If you would like to give a test on Thursday (open for 3 day), and re-use a file from that test in another test on Tuesday then a `duration` of 4 will NOT work because students who accessed the first test on Sunday will be blocked from re-accessing the file on Tuesday. (in this example, we suggest uploading different copies of the file with different URLs)
    <br/><br/>
    Note: If needing to have the same file multiple times, one can use a plus sign (+ - a URL escaped space) appended to the title to cause the player to track it with a different key but still display the same
- name: bg_color
  type: string (any valid W3-CSS color class)
  default: w3-dark-gray
  example: bg_color=w3-light-gray&title=notice+that+title+color+updates,+too&
  description: sets the background color of the player requested color
  note: >
     Note: We use [W3 CSS Version 4](https://www.w3schools.com/w3css/default.asp){:target="_blank"}, any valid color class in that library is valid: [colors list](https://www.w3schools.com/w3css/w3css_colors.asp){:target="_blank"}
- name: btn_color
  type: string (any valid W3-CSS color class)
  default: w3-black
  example: btn_color=w3-red&
  description: sets the color of the play button to the requested color
  note: >
     Note: We use [W3 CSS Version 4](https://www.w3schools.com/w3css/default.asp){:target="_blank"}, any valid color class in that library is valid: [colors list](https://www.w3schools.com/w3css/w3css_colors.asp){:target="_blank"}
- name: btn_hover_color
  type: string (any valid W3-CSS <em>hover</em> color class)
  example: btn_hover_color=w3-hover-red&
  default: w3-hover-gray
  description: sets the color of the play button when the mouse is hovering over it
  note: >
     Note: We use [W3 CSS Version 4](https://www.w3schools.com/w3css/default.asp){:target="_blank"}, any valid color <em>hover</em> class in that library is valid: [colors list](https://www.w3schools.com/w3css/w3css_colors.asp){:target="_blank"} (see section on `Hover Colors`)
# bg_color: w3-black
---


# MusicTheoryPractice.net::media player

Table of contents
* 
{:toc}

## What is this?
This is a quick, insert-able (designed to work in an iframe) media player that limits the number of times the file may be played.

Use it for:
* Quizzes
* Tests
* Guess-That-Tune

## Free as in Coffee

This is completely free to use and published under the [MIT License](/LICENSE){:target="_blank".<br/>
I wouldn't say "no" to some coffee money though.

<a class="w3-btn w3-black w3-round-xxlarge" target="_blank" href="https://www.buymeacoffee.com/mshafer1"><img src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg" alt=""><span style="margin-left:5px;">Buy me a coffee</span></a>


## How To Use:

### (Basic Usage)

* Upload the file you wish to use (MP3 and WAV file formats supported) to a suitable host (see more in [file hosting](#fileHostingReqs) details)
* Get the URL to your file
* Copy the following code and insert your URL in place of the {URL}
 
Example:
```
{% include _examples/_shared.html %}
```

Output:
{% include _examples/_shared.html %}


### (Advanced Options)

Several options are provided to customize the output:

{% for param in page.parameters %}


#### <span class="w3-codespan" id="param_{{ param.name }}">{{ param.name }}</span>: 
{% if param.type %} {{ page.bracket }}{{ param.type }}{{ page.endbracket }} {% endif %}{% if param.default %}(Default if not provided: {{param.default}}) {% endif %}{{ param.description }}

{{ param.note }} 

Example:

```
{% include _examples/_shared.html param=param.example %}
```

Output:

{% include _examples/_shared.html param=param.example %}

{% endfor %}

## More Examples:

* simple: [`test.html`](/test.html)
* lots of buttons: [`test_many.html`](/test_many.html)


## File Hosting Requirements

Here are a few things to keep in mind when choosing where to put the media file:
* It must be accessible via the web (You will need to provide a URL to the *raw file*)
* The file must be served via http**s** - because your browser (or your student's browser) won't allow us to load a file served via http.
