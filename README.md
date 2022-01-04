Firebase Extension: Reverse Geocoding
=====================================

Motivation
----------
I created this extension because I wanted to learn how to create Firebase Extensions.

By the time that I wanted to learn it, there was no proper documentation but open source examples and the firebase sdk source.

Using that I managed to create this extension. Please bare with me, the technology, firebase extensions, is in an **alpha state**, which means that **can change heavily in time and stop working**.

Installation
-------------
In your firebase project, enable the extension features:


```bash
$ firebase --open-sesame extdev
```


Install the extension

```bash
$ firebase ext:install <path_to_this_extension> --project <your_project_name>
```

After executing the install command, the process will ask you to configure the following parameters:

| Parameter  | Definition  |
|---|---|
| LOCATION  | List of possible locations to deploy the extension  |
| COLLECTION_PATH | Path to the collection that host the documents that contain the geodata. |
| LATITUDE_FIELD_NAME| Name of the field in your document that contains the _latitude_ value. Dot notation accepted. |
| LONGITUDE_FIELD_NAME | Name of the field in your document that contains the _longitude_ value. Dot notation accepted. |
| OUTPUT_FIELD_NAME | Name of the field that will be created to contain the reverse geocoding information. |
| GOOGLE_MAPS_API_KEY| Your own personal google maps api key to be used for the geocoding operation. |

Important
----------
* As mentioned above, the Firebase Extensions api is in an alpha state and things might stop working.
* To install this extension, your project will be in Blaze plan or higher, as it perform api calls to google services.