package cli

import (
	"fmt"

	"github.com/example/{{project_name}}/internal/application"
)

func Run() {
	g := application.Greet("world")
	fmt.Println(g.Text)
}
