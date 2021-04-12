import React, {Component} from 'react';
import { Platform, NativeModules } from 'react-native';

export const Languages = {
        bottomBarProfile: {
            en: 'Profile',
            es: 'Perfil'
        },
        bottomBarSearch: {
            en: 'Search',
            es: 'Buscar'
        },
        bottomBarWriter: {
            en: 'Pad',
            es: 'Pad'
        },
        bottomBarExplore: {
            en: 'Browse',
            es: 'Explorar'
        },
        Details: {
            en: 'Details',
            es: 'Detalles'
        },
        Chapters: {
            en: 'Chapters',
            es: 'Capítulos'
        },
        Username: {
            en: 'Username',
            es: 'Usuario'
        },
        Password: {
            en: 'Password',
            es: 'Contraseña'
        },
        repeatPassword: {
            en: 'Repeat Password',
            es: 'Repetir Contraseña'
        },
        Name: {
            en: 'Name',
            es: 'Nombre'
        },
        Gender: {
            en: 'Gender',
            es: 'Género'
        },
        enterUsername: {
            en: 'Enter your username',
            es: 'Ingresa tu usuario'
        },
        enterName: {
            en: 'Enter your name',
            es: 'Ingresa tu nombre'
        },
        chooseGender: {
            en: 'Choose your gender',
            es: 'Elige tu género'
        },
        Male: {
            en: 'Male',
            es: 'Masculino'
        },
        Female: {
            en: 'Female',
            es: 'Femenino'
        },
        Other: {
            en: 'Other',
            es: 'Otro'
        },
        Cancel: {
            en: 'Cancel',
            es: 'Cancelar'
        },
        Save: {
            en: 'Save',
            es: 'Guardar'
        },
        Application: {
            en: 'Application',
            es: 'Aplicación'
        },
        Drafts: {
            en: 'Drafts',
            es: 'Borradores'
        },
        Archive: {
            en: 'Archive',
            es: 'Archivo'
        },
        myAccount: {
            en: 'My account',
            es: 'Mi cuenta'
        },
        AllowPushNotifications: {
            en: 'Allow Push Notification',
            es: 'Permitir Notificaciones'
        },
        enablePagination: {
            en: 'Enable pagination',
            es: 'Habilitar paginación'
        },
        offlineMode: {
            en: 'Premium Mode',
            es: 'Modo Premium'
        },
        signOut: {
            en: 'Sign out',
            es: 'Cerrar sesión'
        },
        signIn: {
            en: 'Sign in',
            es: 'Entrar'
        },
        signUp: {
            en: 'Sign up',
            es: 'Crear cuenta'
        },
        register: {
            en: 'Register',
            es: 'Registrarme'
        },
        rateThisApp: {
            en: 'Rate Newt',
            es: 'Calificar Newt'
        },
        typeBookTitle: {
            en: 'Type book title',
            es: 'Tipea título de libro'
        },
        addChapter: {
            en: 'Add chapter',
            es: 'Añade un capítulo'
        },
        editTitleChapter: {
            en: 'Edit title chapter',
            es: 'Editar título de capítulo'
        },
        typeSomething: {
            en: 'Type something',
            es: 'Escribe algo'
        },
        placeholderEditTitle: {
            en: 'Edit title',
            es: 'Editar título'
        },
        editMode: {
            en: 'Edit Mode',
            es: 'Edición'
        },
        readStart: {
            en: 'Open',
            es: 'Abrir'
        },
        writtenBy: {
            en: 'written by',
            es: 'escrito por'
        },
        firstTitleSection: {
            en: 'Tales for you',
            es: 'Historias para tí'
        },
        noBooksCreated: {
            en: 'Welcome to Creators\nAdd your project below',
            es: 'Bienvenido a Creators\nAgrega tu libro aquí'
        },
        noChaptersCreated: {
            en: 'Here you can start writing\nCreate chapters, drag them to organize',
            es: 'Aquí puedes empezar a escribir\nCrea capítulos y arrástralos para organizar'
        },
        Welcome: {
            en:  'Welcome',
            es: 'Bienvenido'
        },
        booksFound: {
            en: 'books found',
            es: 'libros encontrados'
        },
        onSearch: {
            en: 'Artist, books or gender',
            es: 'Artistas, libros o géneros'
        },
        Results: {
            en: 'Results',
            es: 'Resultados'
        },
        findMoreByTag: {
            en: 'Find your next story',
            es: 'Encuentra tu siguiente historia'
        },
        tags: {
            en: 'Tags',
            es: 'Etiquetas'
        },
        collection: {
            en: 'Collection',
            es: 'Collección'
        },
        thereAreNoResults: {
            en: 'There are no results for your search',
            es: 'No hay resultados para tu búsqueda'
        },
        addTo: {
            en: 'Add to',
            es: 'Añadir a' 
        },
        noInternetConnection: {
            en: 'No internet connection',
            es: 'No tienes conexión a internet'
        },
        noInternetConnectionSubtitle: {
            en: 'You can still read books you\'ve been reading, offline',
            es: 'Puedes continuar los libros que estabas leyendo.'
        },
        lastBooks: {
            en: 'Recently added',
            es: 'Agregados recientemente'
        },
        continueReading: {
            en: 'Continue reading',
            es: 'Continuar leyendo'
        },
        reading: {
            en: 'Reading',
            es: 'Lectura'
        },
        noNotifications: {
            en: 'YOU DO NOT HAVE ANY NOTIFICATIONS YET',
            es: 'NO TIENES NOTIFICACIONES'
        },
        notifications: {
            en: 'Notifications',
            es: 'Notificaciones'
        },
        searchEverywhere:{
            en: 'Search',
            es: 'Buscar'
        },
        builtInWriter:{
            en: 'Built-IN Writer',
            es: 'Modo escritor'
        },
        language: {
            en: 'Language',
            es: 'Lenguaje'
        },
        previewWorks: {
            en: 'Your published work',
            es: 'Tus publicaciones'
        },
        Preview: {
            en: 'Preview',
            es: 'Preview'
        },
        availableToReadOffline:{
            en: 'Available offline',
            es: 'Disponible sin conexión'
        },
        pull: {
            en: 'Pull',
            es: 'Descargar'
        },
        push: {
            en: 'Push',
            es: 'Subir'
        },
        searchContent: {
            en: 'Search content',
            es: 'Buscar contenido'
        },
        mode: {
            en: 'Mode',
            es: 'Modo'
        },
        align: {
            en: 'Align',
            es: 'Alinear'
        },
        fontSize: {
            en: 'Font Size',
            es: 'Tamaño'
        },
        view: {
            en: 'View',
            es: 'Vista'
        },
        youAnd: {
            en: 'YOU &',
            es: 'TU &'
        },
        info: {
            en: 'Info',
            es: 'Información'
        },
        title: {
            en: 'Title',
            es: 'Título'
        },
        publishedBy: {
            en: 'Published by',
            es: 'Publicado por'
        },
        author: {
            en: 'Author',
            es: 'Autor'
        },
        public: {
            en: 'Public',
            es: 'Público'
        },
        private: {
            en: 'Private',
            es: 'Privado'
        },
        stillLoading: {
            en: 'Still loading. Wait a few more seconds.',
            es: 'Aún cargando, espera unos segundos más'
        },
        loading: {
            en: 'Loading',
            es: 'Cargando'
        },
        noChaptersSyncing: {
            en: 'No chapters in this book yet. Syncing.',
            es: 'No hay capítulos aún. Sincronizando'
        },
        slideToRead:{
            en: 'Slide to read',
            es: 'Desliza para leer'
        },
        replicatingEllipsis: {
            en: 'Syncing...',
            es: 'Sincronizando...'
        },
        tryAgainLater:{
            en:'Something went wrong. Try again later.',
            es: 'Algo fue mal. Intenta más tarde'
        },
        delete: {
            en: 'Delete',
            es: 'Borrar'
        },
        edit: {
            en: 'Edit',
            es: 'Editar'
        },
        settingsChapters: {
            en: 'Settings',
            es: 'Más...'
        },
        add: {
            en: 'Add',
            es: 'Nuevo'
        },
        tableOfContents: {
            en: 'Table of Contents',
            es: 'Tabla de Contenidos'
        },
        noContentInChapter: {
            en: 'There\'s no content in this chapter.',
            es: 'No hay contenido en éste capítulo'
        },
        howeverKeep: {
            en: 'However, keep sliding, there\'s more.',
            es: 'Sin embargo, sigue deslizando, hay más'
        },
        show: {
            en: 'Show',
            es: 'Mostrar'
        },
        doesNotExist: {
            en: 'does\'t exists',
            es: 'no existe'
        },
        emailNotMatch: {
            en: 'Your e-mail does not match \nany registered accounts.',
            es: 'Tu e-mail no coincide con \nninguna cuenta registrada.'
        },
        somethingWrongValidatingMail: {
            en: 'Something went wrong validating the mail.',
            es: 'Algo fue mal validando el correo.'
        },
        mailFormatInvalid: {
            en: 'E-mail format invalid',
            es: 'Formato de correo inválido'
        },
        mailAlreadyExists: {
            en: 'The mail is already being used',
            es: 'El correo ya está siendo usado'
        },
        usernameAlreadyExists: {
            en: 'The username is already being used',
            es: 'El usuario ya está siendo usado'
        },
        slide1: {
            en: 'Connect with topics and people through the power of stories',
            es: 'Conecta con temas y personas a través del poder de las historias'
        },
        slide1title: {
            en: 'Meet Bao',
            es: 'Conoce Bao'
        },
        slide2title: {
            en: 'Read. Write. Listen.',
            es: 'Lee. Escucha. Escribe.'
        },
        slide2: {
            en: 'Read thousands of books and write or import your own stories',
            es: 'Lee y escucha miles de libros y escribe o importa tus historias.'
        },
        slide3title: {
            en: 'Offline First',
            es: 'Disponible sin conexión'
        },
        slide3: {
            en: 'Have everything you\'ve been reading or writing always available.',
            es: 'Sigue leyendo y escribiendo sin conexión a internet.'
        },

        slide4title: {
            en: 'Import books',
            es: 'Importa libros'
        },
        slide4: {
            en: 'Import books you\'ve bought or downloaded to read across devices.',
            es: 'Importa libros que hayas comprado o descargado para leer a través de dispositivos.'
        },
        slide5title: {
            en: 'Turn books into audiobooks',
            es: 'Convierte libros a audiolibros'
        },
        slide5: {
            en: 'Play any story out loud, even the ones you create or import.',
            es: 'Reproduce cualquier historia en voz alta. Incluso las que crees o importes.'
        },

        slide7title: {
            en: 'Need a hand?',
            es: 'Necesitas una mano?'
        },
        slide7: {
            en: 'We have two.\nPublish your story and get people from all over the world to make contributions to your work. \n Approve the contributions you like. \nPut your story to work for you.',
            es: 'Tenemos dos. \n Publica tu historia y consigue que personas de todo el mundo te envíe contribuciones para que apruebes.\n Pon tu historia a trabajar por tí.'
        },

        slide6title: {
            en: 'Publish your story',
            es: 'Publica tu historia'
        },
        slide6: {
            en: 'Write privately. Publish whenever you like.',
            es: 'Escribe en privado. Publica cuando quieras.'
        },
        signUpModalTitle: {
            en: 'SIGN UP ON BAO',
            es: 'NUEVO EN BAO?'
        },
        signUpModalDesc: {
            en: 'Get started on Bao.\nWithout subscriptions.',
            es: 'Comienza en Bao.\nSin suscripciones.'
        },
        signInModalTitle: {
            en: 'Sign In',
            es: 'Ingresa'
        },
        signInModalDesc: {
            en: 'Type your e-mail \nor username to continue',
            es: 'Introduce tu e-mail o usuario\npara continuar'
        },

        signInModalTitlePass: {
            en: 'Enter Password',
            es: 'Ingresar Contraseña'
        },
        signInModalDescPass: {
            en: 'Welcome back.\nFood is served.',
            es: 'Bienvenido otra vez.\nLa comida está servida.'
        },

        signInModalTitleChoose: {
            en: 'Choose Account',
            es: 'Seleccionar Cuenta'
        },
        signInModalDescChoose: {
            en: 'Select the account that\nyou want to log in',
            es: 'Selecciona la cuenta donde\nquieres iniciar'
        },
        iLike: {
            en: 'Like',
            es: 'Me gusta'
        },
        people: {
            en: 'People',
            es: 'Personas'
        },
        forgotPassword: {
            en: 'Forgot password?',
            es: 'Olvide mi contraseña'
        },
        profileNoStoriesTitle: {
            en: 'You did not create/import any stories',
            es: 'No has creado/importado libros'
        },
        help: {
            en: 'Help',
            es: 'Ayuda'
        },
        newtWeb: {
            en: 'Bao\'s Web Page',
            es: 'Página web de Bao'
        },
        support: {
            en: 'Support',
            es: 'Soporte'
        },
        contact: {
            en: 'Contact us',
            es: 'Contáctanos'
        },
        profileNoStoriesContent: {
            en: 'This is where your own stories live. Privately, unless you publish.',
            es: 'Aquí es donde tus propias historias viven. Privadas, a menos que publiques.'
        },
        introMailOrUser: {
            en: 'Type your username or e-mail ',
            es: 'Introduce tu e-mail o usuario'
        },
        introMail: {
            en: 'Type your e-mail ',
            es: 'Introduce tu e-mail'
        },
        introUser: {
            en: 'Type your e-mail ',
            es: 'Introduce tu e-mail'
        },
        createWork: {
            en: 'Create Work',
            es: 'Crear'
        },
        create: {
            en: 'Create',
            es: 'Crear'
        },
        thisBookEmpty: {
            en: 'This book it\'s empty',
            es: 'Éste libro está vacío'
        },
        yourBookEmpty: {
            en: 'Your book it\'s empty',
            es: 'Tu libro está vacío'
        },
        writerBookNoParts: {
            en: 'Most likely, there has been a problem with internet connection, or the writer of this book has no created any chapters yet, or there has been a problem trying to retrieve chapters. Check back later.',
            es: 'Ha ocurrido un problema, quizás con tu conexión a internet, o tratando de obtener capítulos o el autor de éste libro aún no ha creado chapters. Intenta más tarde.'
        },
        goBackEmptyBook: {
            en: 'Go back to editing mode to create new parts and write your story',
            es: 'Vuelve a modo edición para crear nuevas partes y escribir tu historia.'
        },
        booksNoChaptersWouldLikeCreate: {
            en: 'This book has no parts.\n Would you like to create one?',
            es: 'Éste libro no tiene partes.\n Quieres crear una?'
        },
        startBuildingYourStory: {
            en: 'Start building your story',
            es: 'Empieza a construir tu historia'
        },
        importEpub: {
            en: 'Import EPUB',
            es: 'Importar EPUB'
        },
        newStory: {
            en: 'New story',
            es: 'Nueva Historia'
        },
        description: {
            en: 'Description',
            es: 'Descripción'
        },
        saveChanges: {
            en: 'Save changes',
            es: 'Guardar cambios'
        },
        couldNotFindBooksByFilter:  {
            en: 'Could not find books\nby this filter.\nComeback later.',
            es: 'Filtro sin resultados.\nPrueba más tarde.'
        },
        discardChanges: {
            en: 'Discard changes',
            es: 'Descartar cambios'
        },
        deleteChapter: {
            en: 'Delete Chapter',
            es: 'Eliminar capítulo'
        },
        liveSync: {
            en: 'Auto Sync',
            es: 'Sincronización'
        },
        sync: {
            en: 'Sync',
            es: 'Sincronización'
        },
        content: {
            en: 'Content',
            es: 'Contenido'
        },
        joinForFree: {
            en: 'Join for free',
            es: 'Únete gratis'
        },
        usernameOrEmail: {
            en: 'Username or e-mail',
            es: 'Usuario o correo electrónico'
        },
        signInFooter: {
            en: 'Have an account?',
            es: 'Tienes una cuenta?'
        },
        signUpFooter: {
            en: 'Don\'t have an account?',
            es: 'No tienes cuenta?'
        },
        imNot: {
            en: 'I\'m not',
            es: 'No soy'
        },
        picked: {
            en: 'Picked',
            es: 'Picked'
        },
        downloads: {
            en: 'Downloads',
            es: 'Descargas'
        },
        newest: {
            en: 'Newest',
            es: 'Nuevos'
        },
        updates: {
            en: 'Updates',
            es: 'Actualizados'
        },
        discover: {
            en: 'Discover',
            es: 'Descubre'
        },
        noWorksYet: {
            en: 'Feel like writing?\nCreate or import your work\nin this place',
            es: 'Crea o importa tu trabajo\nen éste lugar'
        },
        Share: {
            en: 'Share',
            es: 'Compartir'
        },
        Activities: {
            en: 'Activities',
            es: 'Actividades'
        },
        Settings: {
            en: 'Settings',
            es: 'Configuración'
        },
        Status: {
            en: 'Status',
            es: 'Estado'
        },
        Stories: {
            en: 'Stories',
            es: 'Historias'
        },
        homeNoCollectionsTitle: {
            en: 'There are no collections',
            es: 'No tienes collecciones'
        },
        homeNoCollectionsDesc: {
            en: 'Go to any book to create new collections and fill them with stories.',
            es: 'Ve a cualquier libro para crear collecciones y llenarlas de historias'
        },
        updateModalTitle: {
            en: 'Update Bao',
            es: 'Actualiza Bao'
        },
        updateModalContent: {
            en: 'There\'s a new update with bugfixes and new features.\n Would you like to update now?',
            es: 'Hay una nueva actualización con nuevas funciones y arreglos.\n Quieres actualizar ahora?'
        },
        update: {
            en: 'Update',
            es: 'Actualizar'
        },
        createOneBelow: {
            en: 'Create one below',
            es: 'Crea una abajo'
        },
        homeNoFollowingTitle: {
            en: 'You\'re not following anyone',
            es: 'No sigues a nadie'
        },
        homeNoFollowingDesc: {
            en: 'Books are uploaded by users. Go to their profile to following them and stay up with latest stories.',
            es: 'Las historias son subidas por otros usuarios. Ve a sus perfiles para seguirlos y no perderte actualizaciones.'
        },
        follow: {
            en: 'Follow',
            es: 'Seguir'
        },
        unfollow: {
            en: 'Unfollow',
            es: 'Dejar de seguir'
        },
        homeNoPickedTitle: {
            en: 'There was a problem',
            es: 'Hubo un problema'
        },
        homeNoPickedDesc: {
            en: 'Newt couldn\'t find the latest stories from the cloud.\nThis could have happen due to lack of internet,or because it\'s your first time in Newt and we are experiencing an overload in our servers.\nThis has been reported and our engineers are resolving the issue. \n Check back later.',
            es: 'No pudimos encontrar las últimas historias de la nube.\nÉsto pudo haber pasado por falta de internet, o porque es tu primera vez en Newt y estamos experimentando saturación en nuestros servidores. \n Ésto ha sido reportado y nuestros ingenieros están trabajando en resolver el problema. \n Prueba más tarde '
        },
        close: {
            en: 'Close',
            es: 'Cerrar'
        },
        homeNoLikedTitle: {
            en: 'We couldn\'t find books you like',
            es: 'No pudimos encontrar libros que te gustaron'
        },
        homeNoLikedDesc: {
            en: 'Have you liked any stories yet?',
            es: 'Has indicado que te gusta alguna historia todavía?'
        },
        homeNoNotificationsTitle: {
            en: 'No notifications yet',
            es: 'No tienes notificaciones'
        },
        keepScreenAwake: {
            en: 'Keep Screen Awake',
            es: 'Mantener pantalla encendida'
        },
        homeNoNotificationsDesc: {
            en: 'Check back later',
            es: 'Vuelve a revisar más tarde'
        },
        engines: {
            en: 'Engine',
            es: 'Motor'
        },
        voice: {
            en: 'Voice',
            es: 'Voz'
        },
        tone: {
            en: 'Tone',
            es: 'Tono'
        },
        speed: {
            en: 'Speed',
            es: 'Velocidad'
        },
        playFromHere: {
            en: 'Play from here',
            es: 'Reproducir desde aquí'
        },
        play: {
            en: 'Play',
            es: 'Reproducir'
        },
        pause: {
            en: 'Pause',
            es: 'Pausar'
        },
        paragraph: {
            en: 'Paragraph',
            es: 'Párrafo'
        },
        headline: {
            en: 'Headline',
            es: 'Título'
        },
        image: {
            en: 'Image',
            es: 'Imagen'
        },
        list: {
            en: 'List',
            es: 'Lista'
        },
        checklist: {
            en: 'Checklist',
            es: 'Tareas'
        },
        syncLiveIfDisabled: {
            en: 'If disabled, only syncs on startup',
            es: 'Deshabilitado sincroniza al iniciar'
        },
        quote: {
            en: 'Quote',
            es: 'Cita'
        },
        warning: {
            en: 'Warning',
            es: 'Advertencia'
        },
        delimiter: {
            en: 'Delimiter',
            es: 'Delimitador'
        },
        link: {
            en: 'Link',
            es: 'Enlace'
        },
        new: {
            en: 'New',
            es: 'Nuevo'
        },
        select: {
            en: 'Select',
            es: 'Seleccionar'
        },
        realTime: {
            en: 'Real time',
            es: 'Tiempo real'
        },
        newRemoteChanges: {
            en: 'This part has new updates',
            es: 'Ésta parte tiene nuevas actualizaciones.'
        },
        newRemoteChangesCollections: {
            en: 'New changes in Collections',
            es: 'Nuevos cambios en Collecciones'
        },
        newRemoteChangesFollowing: {
            en: 'New changes in Following',
            es: 'Nuevos cambios en Siguiendo'
        },
        newRemoteChangesLiked: {
            en: 'New changes. Reload.',
            es: 'Nuevos cambios. Actualizar.'
        },
    };

export const getLang = function () {
  let locale: string;
  // iOS
  if (
    NativeModules.SettingsManager &&
    NativeModules.SettingsManager.settings &&
    NativeModules.SettingsManager.settings.AppleLanguages
  ) {
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    // Android
  } else if (NativeModules.I18nManager) {
    locale = NativeModules.I18nManager.localeIdentifier;
  }


  if (typeof locale === 'undefined') {
    __DEV__ && console.log('Couldnt get locale');
    return 'en';
  }

  if(locale.includes("en")){
    return 'en';
  } else if(locale.includes("es")){
    return 'es'
  } else {
    return 'en';
  }
  //console.log("is eglish", locale.includes("en"), locale.includes("es"))

  return locale;
}

export const getLangString = function () {
  let locale: string;
  // iOS
  if (
    NativeModules.SettingsManager &&
    NativeModules.SettingsManager.settings &&
    NativeModules.SettingsManager.settings.AppleLanguages
  ) {
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    // Android
  } else if (NativeModules.I18nManager) {
    locale = NativeModules.I18nManager.localeIdentifier;
  }

  if (typeof locale === 'undefined') {
    __DEV__ && console.log('Couldnt get locale');
    return 'English';
  }

  if(locale.includes("en")){
    return 'English';
  } else if(locale.includes("es")){
    return 'Español'
  } else {
    return 'English';
  }
  //console.log("is eglish", locale.includes("en"), locale.includes("es"))

  return locale;
}

export const arrayLanguages = {
  "ES":"es",
  "EN":"en"
}   