<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class RudderstackController extends AbstractController
{
    #[Route('/', name: 'rudderstack_home')]
    public function index(): Response
    {
        // Get RudderStack configuration from environment variables
        $writeKey = $_ENV['RUDDERSTACK_WRITE_KEY'] ?? '';
        $dataplaneUrl = $_ENV['RUDDERSTACK_DATAPLANE_URL'] ?? '';

        return $this->render('rudderstack/index.html.twig', [
            'rudderstack_write_key' => $writeKey,
            'rudderstack_dataplane_url' => $dataplaneUrl,
        ]);
    }
} 
