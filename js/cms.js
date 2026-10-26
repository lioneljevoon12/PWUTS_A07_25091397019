$(document).ready(function () {
  var STORAGE_KEY = 'meownesa_cms_data';

  function getStoredArticles() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return window.defaultArticles || [];
  }

  var articles = getStoredArticles();

  function saveArticles() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {}
  }

  function renderArticles(data) {
    var $tbody = $('#cmsTableBody');
    $tbody.empty();
    if (!data.length) {
      $tbody.append('<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--ink-muted);">Tidak ada artikel yang sesuai.</td></tr>');
      return;
    }
    data.forEach(function (art) {
      var badge = art.status === 'Terbit' ? '<span class="badge-green">TERBIT</span>' : '<span class="badge-gold">DRAFT</span>';
      var tr = '<tr>' +
        '<td><strong>' + art.title + '</strong></td>' +
        '<td><span class="badge-status normal">' + art.category + '</span></td>' +
        '<td>' + art.date + '</td>' +
        '<td>' + art.author + '</td>' +
        '<td>' + badge + '</td>' +
        '<td><div style="display: flex; gap: 4px;">' +
          '<button type="button" class="btn-icon btn-view-art" data-id="' + art.id + '" title="Lihat Detail">&#128065;</button>' +
          '<button type="button" class="btn-icon btn-edit-art" data-id="' + art.id + '" title="Edit Artikel">&#9998;</button>' +
          '<button type="button" class="btn-icon btn-delete-art" data-id="' + art.id + '" title="Hapus">&#128465;</button>' +
        '</div></td>' +
      '</tr>';
      $tbody.append(tr);
    });
  }

  function clearErrors() {
    $('.field-error').text('').hide();
    $('.filter-input, .filter-select').removeClass('input-error');
  }

  function showError($field, $err, msg) {
    $field.addClass('input-error');
    $err.text(msg).show();
  }

  $(document).off('.cms');

  $(document).on('click.cms', '.btn-view-art', function () {
    var id = $(this).data('id');
    var art = articles.find(function (a) { return a.id === id; });
    if (!art) return;
    $('#viewArtTitle').text(art.title);
    $('#viewArtCategory').text(art.category);
    $('#viewArtDate').text(art.date);
    $('#viewArtAuthor').text(art.author);
    $('#viewArtStatus').text(art.status);
    $('#viewArtContent').text(art.content);
    $('#modalViewArticle').fadeIn(200);
  });

  $(document).on('click.cms', '#closeModalViewArt, #btnCloseModalViewArt, #modalViewArticle', function (e) {
    if (e.target === this) {
      $('#modalViewArticle').fadeOut(150);
    }
  });

  $(document).on('click.cms', '#btnOpenAddArt', function () {
    clearErrors();
    $('#modalArtFormTitle').text('Tulis Artikel & Edukasi Baru');
    $('#editArtId').val('');
    $('#editArtTitle').val('');
    $('#editArtCategory').prop('selectedIndex', 0);
    $('#editArtStatus').val('Terbit');
    $('#editArtDate').val(new Date().toISOString().split('T')[0]);
    $('#editArtAuthor').val('Lionel Jevon - Tim Medis');
    $('#editArtContent').val('');
    $('#modalEditArticle').fadeIn(200);
  });

  $(document).on('click.cms', '.btn-edit-art', function () {
    clearErrors();
    var id = $(this).data('id');
    var art = articles.find(function (a) { return a.id === id; });
    if (!art) return;
    $('#modalArtFormTitle').text('Ubah Artikel & Edukasi');
    $('#editArtId').val(art.id);
    $('#editArtTitle').val(art.title);
    $('#editArtCategory').val(art.category);
    $('#editArtDate').val(art.date);
    $('#editArtAuthor').val(art.author);
    $('#editArtStatus').val(art.status);
    $('#editArtContent').val(art.content);
    $('#modalEditArticle').fadeIn(200);
  });

  $(document).on('click.cms', '#closeModalEditArt, #btnCancelEditArt, #modalEditArticle', function (e) {
    if (e.target === this) {
      $('#modalEditArticle').fadeOut(150);
    }
  });

  $(document).on('submit.cms', '#formEditArticle', function (e) {
    e.preventDefault();
    clearErrors();

    var isValid = true;
    var title = $('#editArtTitle').val().trim();
    var cat = $('#editArtCategory').val();
    var status = $('#editArtStatus').val();
    var date = $('#editArtDate').val().trim();
    var author = $('#editArtAuthor').val().trim();
    var content = $('#editArtContent').val().trim();

    if (!title || title.length < 5) {
      showError($('#editArtTitle'), $('#errArtTitle'), 'Judul artikel wajib minimal 5 karakter.');
      isValid = false;
    }
    if (!date) {
      showError($('#editArtDate'), $('#errArtDate'), 'Tanggal publikasi wajib diisi.');
      isValid = false;
    }
    if (!author || author.length < 3) {
      showError($('#editArtAuthor'), $('#errArtAuthor'), 'Penulis wajib diisi minimal 3 karakter.');
      isValid = false;
    }
    if (!content || content.length < 10) {
      showError($('#editArtContent'), $('#errArtContent'), 'Konten artikel wajib minimal 10 karakter.');
      isValid = false;
    }

    if (!isValid) return;

    var editId = $('#editArtId').val();
    if (editId) {
      var target = articles.find(function (a) { return a.id === editId; });
      if (target) {
        target.title = title; target.category = cat; target.status = status;
        target.date = date; target.author = author; target.content = content;
      }
    } else {
      var newArt = {
        id: 'art-' + (articles.length + 1),
        title: title, category: cat, status: status,
        date: date, author: author, content: content
      };
      articles.unshift(newArt);
    }

    saveArticles();
    renderArticles(articles);
    $('#modalEditArticle').fadeOut(150);
  });

  $(document).on('click.cms', '.btn-delete-art', function () {
    var id = $(this).data('id');
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      articles = articles.filter(function (a) { return a.id !== id; });
      saveArticles();
      renderArticles(articles);
    }
  });

  renderArticles(articles);
});