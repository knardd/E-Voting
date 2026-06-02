use Inertia\Testing\AssertableInertia as Assert;

test('halaman login dapat diakses', function () {
    $this->get('/login')
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('Auth/Login') // Sesuaikan dengan nama komponen React kamu di resources/js/Pages
        );
});